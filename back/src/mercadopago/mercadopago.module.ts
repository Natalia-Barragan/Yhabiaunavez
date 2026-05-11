import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { MercadopagoWebhookController } from './mercadopago-webhook.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule, ConfigModule],
  controllers: [MercadopagoController, MercadopagoWebhookController],
  providers: [MercadopagoService],
  exports: [MercadopagoService],
})
export class MercadopagoModule {}