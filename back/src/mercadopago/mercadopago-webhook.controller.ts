import { Controller, Post, Body, Logger, Headers } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago/webhook')
export class MercadopagoWebhookController {
  private readonly logger = new Logger(MercadopagoWebhookController.name);

  constructor(private mercadopagoService: MercadopagoService) {}

  @Post()
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-request-id') requestId: string,
  ) {
    try {
      this.logger.log(`Webhook recibido con requestId: ${requestId}`);

      // Solo procesar notificaciones de pago
      if (payload.type !== 'payment') {
        this.logger.log(`Ignorando webhook tipo: ${payload.type}`);
        return { received: true };
      }

      // Procesar el webhook
      const result = await this.mercadopagoService.processWebhook(payload.data);
      
      this.logger.log(`Webhook procesado para orden: ${result.orderId}`);
      return { received: true, processed: true };
    } catch (error: any) {
      this.logger.error(`Error procesando webhook: ${error.message}`);
      return { received: true, error: error.message };
    }
  }
}