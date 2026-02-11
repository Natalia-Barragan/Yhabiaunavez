import { IsString, IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ example: 'John Doe', description: 'Customer name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Customer email' })
    @IsEmail({}, { message: 'El formato del email no es válido' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '+1234567890', description: 'Customer phone number' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: '123 Main St', description: 'Customer address' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 'New York', description: 'City' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'NY', description: 'State' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: '10001', description: 'Zip code' })
    @IsString()
    @IsNotEmpty()
    zipCode: string; // Asegúrate de que coincida con el nombre en la Entidad

    @ApiProperty({ example: 'USA', description: 'Country' })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({ example: 'Vip customer', description: 'Additional notes', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(500) // Evita que guarden textos excesivamente largos que pesen en la DB
    notes?: string;
}