import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'order_items' })
export class OrderItem {
    @ApiProperty({ example: 'uuid-string', description: 'Order Item ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 2, description: 'Quantity' })
    @Column({ type: 'int' })
    quantity: number;

    @ApiProperty({ example: 49.99, description: 'Price at purchase time' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'SET NULL', eager: false })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @ApiProperty({ example: 'uuid-string', description: 'Product ID', required: false })
    @Column({ nullable: true })
    productId: string | null;

    @ApiProperty({ example: 'S', description: 'Selected size' })
    @Column({ type: 'varchar', nullable: true })
    size: string | null;
}