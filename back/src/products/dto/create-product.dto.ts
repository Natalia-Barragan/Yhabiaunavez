import {
    IsString,
    IsNumber,
    IsOptional,
    IsInt,
    Min,
    IsPositive,
    IsNotEmpty,
    IsUUID,
    IsUrl,
    IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15', description: 'The name of the product' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    name: string;

    @ApiProperty({ example: 'Latest smartphone from Apple', description: 'Product description', required: false })
    @IsString()
    @IsOptional()
    description?: string;


    @ApiProperty({ example: 999.99, description: 'Price of the product' })
    @IsNumber({ maxDecimalPlaces: 2 }) // Ayuda con la precisión de precios
    @IsPositive()
    @Type(() => Number) // Transforma string a number para multipart/form-data
    price: number;

    @ApiProperty({ example: 50, description: 'Stock quantity' })
    @IsInt()
    @Min(0)
    @Type(() => Number) // Transforma string a number
    stock: number;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL', required: false })
    @IsUrl() // Valida que sea una URL real de imagen
    @IsOptional()
    image?: string;

    @ApiProperty({ example: ['url1', 'url2'], description: 'Array of existing image URLs to keep', required: false })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [value];
            }
        }
        return value;
    })
    existingImages?: string[];

    @ApiProperty({ example: 'uuid-of-category', description: 'Category ID' })
    @IsUUID() // Importante: debe coincidir con el tipo de ID de tu entidad Category
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        example: { '0-3m': 10, '3-6m': 5 },
        description: 'Stock por talle',
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    })
    stockBySize?: Record<string, number>;
}