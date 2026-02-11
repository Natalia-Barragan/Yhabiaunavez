import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-item';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({ example: 'uuid-string', description: 'Product ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'iPhone 15', description: 'Product Name' })
    @Column()
    name: string;

    @ApiProperty({
        example: ['0-3m', '3-6m', '6-12m', '12-18m', '12-24m'],
        type: [String],
        description: 'Lista de talles disponibles'
    })
    @Column('text', { array: true, default: [] })
    sizes: string[];

    @ApiProperty({ example: 999.99, description: 'Product Price' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ApiProperty({ example: 'Latest smartphone from Apple', description: 'Product Description' })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ example: 50, description: 'Stock Quantity' })
    @Column({ type: 'int' })
    stock: number;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product Image URL' })
    @Column()
    image: string;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Creation date' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Last update date' })
    @UpdateDateColumn()
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ApiProperty({ example: 'uuid-string', description: 'Category ID', required: false })
    @Column({ nullable: true })
    categoryId: string;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @ApiProperty({ example: 'uuid-string', description: 'Order ID', required: false })
    @Column({ nullable: true })
    orderId: string;
}