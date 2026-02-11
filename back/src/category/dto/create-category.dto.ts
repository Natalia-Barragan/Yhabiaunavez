import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
    @MinLength(3, { message: 'El nombre es muy corto (mínimo 3 caracteres)' })
    @MaxLength(50, { message: 'El nombre es muy largo (máximo 50 caracteres)' })
    name: string;
}