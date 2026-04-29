import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;
  private readonly logger = new Logger(MercadopagoService.name);

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {
    const accessToken = this.validateToken();
    this.client = new MercadoPagoConfig({ accessToken });
  }

  private validateToken(): string {
    const token = this.configService.get<string>('MP_ACCESS_TOKEN');
    const nodeEnv = process.env.NODE_ENV || 'development';

    if (!token || token.trim() === '' || token === 'APP_USR-test') {
      const message = 'MP_ACCESS_TOKEN no está configurado';
      
      if (nodeEnv === 'production') {
        this.logger.error(message);
        throw new BadRequestException('Mercado Pago no está configurado para producción');
      } else {
        this.logger.warn(message + ' - Usando fallback para desarrollo');
      }
    }

    return token || 'APP_USR-test';
  }

  async createPreference(orderId: string) {
    try {
      const order = await this.ordersService.findOne(orderId);
      if (!order) {
        throw new NotFoundException(`Orden ${orderId} no encontrada`);
      }

      const preference = new Preference(this.client);
      
      const items = order.items.map(item => ({
        id: item.product.id,
        title: item.product.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: 'ARS',
      }));

      const envFrontend = this.configService.get<string>('FRONTEND_URL');
      const frontendUrl = (envFrontend && envFrontend.startsWith('http')) ? envFrontend.replace(/\/$/, '') : 'http://localhost:3001';
      
      const successUrl = `${frontendUrl}/checkout/success`;
      const failureUrl = `${frontendUrl}/checkout/failure`;
      const pendingUrl = `${frontendUrl}/checkout/pending`;

      const body = {
        items,
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        external_reference: order.id,
      };

      this.logger.log('Creando preferencia MP para orden: ' + orderId);
      // @ts-ignore
      const result = await preference.create({ body });
      return result;
    } catch (error: any) {
      this.logger.error(`Error creando preferencia MP: ${error.message}`);
      throw new BadRequestException('Error al crear la preferencia de pago: ' + (error.message || ''));
    }
  }

  async verifyPayment(paymentId: string) {
    return await this.verifyPaymentWithRetry(paymentId, 0);
  }

  private async verifyPaymentWithRetry(paymentId: string, attempt: number = 0): Promise<any> {
    const maxAttempts = 3;
    
    try {
      this.logger.log(`Verificando pago: ${paymentId} (intento ${attempt + 1}/${maxAttempts})`);
      const payment = new Payment(this.client);
      const paymentData = await payment.get({ id: paymentId });
      
      if (paymentData.status === 'approved' && paymentData.external_reference) {
        await this.ordersService.update(paymentData.external_reference, { status: 'pagado' } as any);
        this.logger.log(`Pago ${paymentId} aprobado para orden: ${paymentData.external_reference}`);
        return { success: true, status: 'pagado', orderId: paymentData.external_reference };
      }
      
      this.logger.log(`Pago ${paymentId} status: ${paymentData.status}`);
      return { success: true, status: paymentData.status };
    } catch(err: any) {
      if (attempt < maxAttempts - 1) {
        const delayMs = 1000 * Math.pow(2, attempt); // exponencial: 1s, 2s, 4s
        this.logger.warn(`Reintentando en ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.verifyPaymentWithRetry(paymentId, attempt + 1);
      } else {
        this.logger.error(`Error verificando pago ${paymentId} después de ${maxAttempts} intentos: ${err.message}`);
        throw err;
      }
    }
  }

  async processWebhook(data: any) {
    try {
      const paymentId = data.id;
      this.logger.log(`Procesando webhook para pago: ${paymentId}`);

      const payment = new Payment(this.client);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status === 'approved' && paymentData.external_reference) {
        await this.ordersService.update(paymentData.external_reference, { status: 'pagado' } as any);
        this.logger.log(`Orden ${paymentData.external_reference} marcada como pagada vía webhook`);
        return { success: true, orderId: paymentData.external_reference };
      }

      this.logger.log(`Webhook pago no aprobado, status: ${paymentData.status}`);
      return { success: true, status: paymentData.status };
    } catch (error: any) {
      this.logger.error(`Error procesando webhook: ${error.message}`);
      throw error;
    }
  }
}