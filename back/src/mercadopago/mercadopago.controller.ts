import { Controller, Post, Body, Param } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('create-preference')
  async createPreference(@Body() body: { orderId: string }) {
    if (!body.orderId) {
      return { error: 'Falta orderId' };
    }
    const preference = await this.mercadopagoService.createPreference(body.orderId);
    return {
      id: preference.id,
      init_point: preference.init_point,
    };
  }

  @Post('verify')
  async verifyPayment(@Body() body: { paymentId: string }) {
    if (!body.paymentId) {
      return { error: 'Falta paymentId' };
    }
    return await this.mercadopagoService.verifyPayment(body.paymentId);
  }
}
