import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
    @ApiProperty({ example: 'uuid-of-product', description: 'Product ID' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 2, description: 'Quantity of the product' })
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 'S', description: 'Selected size' })
    @IsString()
    @IsOptional()
    size?: string;
}

export enum OrderStatus {
    PENDING = 'pendiente',
    PAGADO = 'pagado',
    ENVIADO = 'enviado',
    CANCELLED = 'cancelado'
}

export class CreateOrderDto {
    @ApiProperty({ example: 'uuid-of-customer', description: 'Customer ID' })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({ type: [CreateOrderItemDto], description: 'List of order items' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Order date', required: false })
    @IsOptional()
    orderDate?: Date;

    @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING, description: 'Order status', required: false })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;
}