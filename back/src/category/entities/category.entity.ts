import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'categories' })
export class Category {
    @ApiProperty({ example: 'uuid-string', description: 'Category ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Electronics', description: 'Category Name' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Creation date' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Last update date' })
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}