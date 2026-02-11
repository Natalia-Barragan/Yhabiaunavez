import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

}