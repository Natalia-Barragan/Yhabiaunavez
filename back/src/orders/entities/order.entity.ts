import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { OrderItem } from './order-item';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'orders' })
export class Order {
    @ApiProperty({ example: 'uuid-string', description: 'Order ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 150.50, description: 'Order Total' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @ApiProperty({ example: 'pending', description: 'Order Status' })
    @Column({ default: 'pending' })
    status: string;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Creation date' })
    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer: Customer;

    @ApiProperty({ example: 'uuid-string', description: 'Customer ID' })
    @Column()
    customerId: string;

    // ESTA ES LA RELACIÓN QUE USA EL SERVICIO
    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @ApiProperty({ description: 'Products in the order', required: false })
    products: any;
}