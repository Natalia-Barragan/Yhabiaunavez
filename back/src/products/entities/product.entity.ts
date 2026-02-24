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


    @ApiProperty({ example: 999.99, description: 'Product Price' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ApiProperty({ example: 'Latest smartphone from Apple', description: 'Product Description' })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ example: 50, description: 'Stock Quantity' })
    @Column({ type: 'int', default: 0 })
    stock: number;

    @ApiProperty({
        example: { '0-3m': 10, '3-6m': 5 },
        description: 'Stock por talle'
    })
    @Column('jsonb', { default: {} })
    stockBySize: Record<string, number>;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product Image URL' })
    @Column()
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ nullable: true })
    categoryId: string;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];
}