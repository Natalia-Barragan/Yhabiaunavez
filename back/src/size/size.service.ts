import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './entities/size.entity';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';

@Injectable()
export class SizeService {
    constructor(
        @InjectRepository(Size)
        private readonly sizeRepository: Repository<Size>,
    ) { }

    async create(createSizeDto: CreateSizeDto) {
        const existing = await this.sizeRepository.findOne({ where: { label: createSizeDto.label } });
        if (existing) {
            throw new ConflictException(`El talle "${createSizeDto.label}" ya existe`);
        }

        const size = this.sizeRepository.create(createSizeDto);
        return await this.sizeRepository.save(size);
    }

    async findAll() {
        return await this.sizeRepository.find({ order: { createdAt: 'ASC' } });
    }

    async findOne(id: string) {
        const size = await this.sizeRepository.findOne({ where: { id } });
        if (!size) {
            throw new NotFoundException(`Talle con ID ${id} no encontrado`);
        }
        return size;
    }

    async update(id: string, updateSizeDto: UpdateSizeDto) {
        const size = await this.findOne(id);
        Object.assign(size, updateSizeDto);
        return await this.sizeRepository.save(size);
    }

    async remove(id: string) {
        const size = await this.findOne(id);
        await this.sizeRepository.remove(size);
        return { message: `Talle ${id} eliminado correctamente`, deleted: true };
    }
}
