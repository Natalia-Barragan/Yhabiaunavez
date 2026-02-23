import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(dto: CreateCategoryDto) {
    console.log('Creando categoría:', dto);
    try {
      const category = this.categoryRepository.create(dto);
      const saved = await this.categoryRepository.save(category);
      console.log('Categoría guardada:', saved);
      return saved;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  async findAll() {
    // Incluimos los productos para que el frontend pueda armar menús desplegables
    return await this.categoryRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    try {
      const category = await this.findOne(id);
      await this.categoryRepository.remove(category);
      return { message: `Categoría ${id} eliminada correctamente`, deleted: true };
    } catch (error: any) {
      throw error;
    }
  }
}