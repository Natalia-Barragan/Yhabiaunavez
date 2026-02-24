import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sizes' })
export class Size {
    @ApiProperty({ example: 'uuid-string', description: 'Size ID' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: '0-3m', description: 'Size Label' })
    @Column({ unique: true })
    label: string;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Creation date' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2023-10-25T10:00:00Z', description: 'Last update date' })
    @UpdateDateColumn()
    updatedAt: Date;
}
