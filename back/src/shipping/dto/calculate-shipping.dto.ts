import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingItemDto {
  @ApiProperty({ example: 'uuid-of-product', description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of items' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}

export class CalculateShippingDto {
  @ApiProperty({ example: '1425', description: 'Destination Postal Code' })
  @IsString()
  @IsNotEmpty()
  postalCodeDestination: string;

  @ApiProperty({ type: [ShippingItemDto], description: 'List of items in the cart', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingItemDto)
  @IsOptional()
  items?: ShippingItemDto[];
}
