import { Controller, Post, Body } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('create-preference')
  async createPreference(@Body() body: { orderId: string; withInstallments?: boolean; shippingCost?: number }) {
    if (!body.orderId) {
      return { error: 'Falta orderId' };
    }
    const preference = await this.mercadopagoService.createPreference(
      body.orderId,
      body.withInstallments ?? false,
      body.shippingCost ?? 0,
    );
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
