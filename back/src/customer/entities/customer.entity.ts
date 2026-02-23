import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'customers' })
export class Customer {
    @ApiProperty({ example: 'uuid-string', description: 'Customer ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'John Doe', description: 'Customer Name' })
    @Column({ nullable: false })
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Customer Email' })
    @Column({ unique: true, nullable: false, })
    email: string;

    @ApiProperty({ example: '+1234567890', description: 'Customer Phone' })
    @Column({ nullable: false, length: 15 })
    phone: string;

    @ApiProperty({ example: '123 Main St', description: 'Address' })
    @Column({ nullable: false })
    address: string;

    @ApiProperty({ example: 'New York', description: 'City' })
    @Column({ nullable: false })
    city: string;

    @ApiProperty({ example: 'NY', description: 'State' })
    @Column({ nullable: false })
    state: string;

    @ApiProperty({ example: '10001', description: 'Zip Code' })
    @Column({ nullable: false })
    zipCode: string;

    @ApiProperty({ example: 'USA', description: 'Country' })
    @Column({ nullable: false })
    country: string;

    @ApiProperty({ example: 'VIP Customer', description: 'Notes', required: false })
    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}