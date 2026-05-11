import { Controller, Post, Body, Logger, Headers, UnauthorizedException } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('mercadopago/webhook')
export class MercadopagoWebhookController {
  private readonly logger = new Logger(MercadopagoWebhookController.name);

  constructor(
    private mercadopagoService: MercadopagoService,
    private configService: ConfigService,
  ) {}

  @Post()
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
  ) {
    this.verifySignature(payload, signature, requestId);

    try {
      this.logger.log(`Webhook recibido con requestId: ${requestId}`);

      if (payload.type !== 'payment') {
        this.logger.log(`Ignorando webhook tipo: ${payload.type}`);
        return { received: true };
      }

      const result = await this.mercadopagoService.processWebhook(payload.data);
      this.logger.log(`Webhook procesado para orden: ${result.orderId}`);
      return { received: true, processed: true };
    } catch (error: any) {
      this.logger.error(`Error procesando webhook: ${error.message}`);
      return { received: true, error: error.message };
    }
  }

  private verifySignature(payload: any, signature: string, requestId: string) {
    const secret = this.configService.get<string>('MP_WEBHOOK_SECRET');

    // Si no hay secret configurado, solo logueamos advertencia (para no romper en dev)
    if (!secret) {
      this.logger.warn('MP_WEBHOOK_SECRET no configurado — omitiendo verificación de firma');
      return;
    }

    if (!signature) {
      throw new UnauthorizedException('Webhook sin firma');
    }

    // El header x-signature tiene formato: ts=<timestamp>,v1=<hash>
    const parts = Object.fromEntries(
      signature.split(',').map(part => part.split('=') as [string, string])
    );
    const ts = parts['ts'];
    const receivedHash = parts['v1'];

    if (!ts || !receivedHash) {
      throw new UnauthorizedException('Formato de firma inválido');
    }

    // MP firma el string: id:<data.id>;request-id:<requestId>;ts:<ts>;
    const dataId = payload?.data?.id ?? '';
    const signedString = `id:${dataId};request-id:${requestId};ts:${ts};`;

    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(signedString)
      .digest('hex');

    if (expectedHash !== receivedHash) {
      this.logger.error('Firma de webhook inválida — posible intento de fraude');
      throw new UnauthorizedException('Firma de webhook inválida');
    }
  }
}
