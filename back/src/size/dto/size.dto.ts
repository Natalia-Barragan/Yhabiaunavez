import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDto {
    @ApiProperty({ example: '0-3m', description: 'The label for the size' })
    @IsString()
    @IsNotEmpty({ message: 'La etiqueta del talle no puede estar vacía' })
    label: string;
}

export class UpdateSizeDto {
    @ApiProperty({ example: '3-6m', description: 'The label for the size', required: false })
    @IsString()
    @IsNotEmpty({ message: 'La etiqueta del talle no puede estar vacía' })
    label: string;
}
