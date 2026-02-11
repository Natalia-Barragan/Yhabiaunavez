import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SupabaseService } from "src/supabase/supabase.service";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly supabaseService: SupabaseService,
    ) { }

    async create(dto: CreateProductDto, file: Express.Multer.File) {
        try {
            console.log('DTO received:', dto);
            console.log('File received:', file ? file.originalname : 'No file');

            // CORRECCIÓN: Agregamos await para que imageUrl sea string y no Promise/void
            let imageUrl = '';
            if (file) {
                imageUrl = await this.supabaseService.uploadImage(file);
                console.log('Image uploaded to Supabase:', imageUrl);
            }

            const product = this.productRepository.create({
                ...dto,
                image: imageUrl, // Aquí ya no marcará error de 'void'
            });

            const savedProduct = await this.productRepository.save(product);
            console.log('Product saved to DB:', savedProduct);
            return savedProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');

        if (file) {
            // Si mandan una foto nueva, la actualizamos en Supabase
            product.image = await this.supabaseService.uploadImage(file);
        }

        Object.assign(product, dto);
        return await this.productRepository.save(product);
    }

    async findAll() {
        return await this.productRepository.find({ relations: ['category'] });
    }

    async findOne(id: string) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async remove(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');
        await this.productRepository.remove(product);
        return { message: `Producto ${id} eliminado correctamente`, deleted: true };
    }
}