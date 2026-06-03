import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calcular tarifas de envío usando Correo Argentino' })
  @ApiResponse({ status: 200, description: 'Tarifas calculadas con éxito.' })
  calculateRates(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.shippingService.calculateRates(calculateShippingDto);
  }
}
