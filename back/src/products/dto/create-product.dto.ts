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

    @ApiProperty({
        type: [String],
        example: ['0-3m', '6-9m'],
        required: false
    })
    @IsOptional()
    @IsArray({ message: 'Los talles deben ser un arreglo' })
    @IsString({ each: true })
    @Transform(({ value }) => {
        // Si llega como un solo string (común en multipart), lo metemos en un array
        if (typeof value === 'string') {
            return [value];
        }
        // Si Swagger manda múltiples campos, ya llega como array, así que lo dejamos pasar
        return value;
    })
    sizes?: string[];

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

    @ApiProperty({ example: 'uuid-of-category', description: 'Category ID' })
    @IsUUID() // Importante: debe coincidir con el tipo de ID de tu entidad Category
    @IsNotEmpty()
    categoryId: string;
}