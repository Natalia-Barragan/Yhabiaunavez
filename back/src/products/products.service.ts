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

    async create(dto: CreateProductDto, files: Express.Multer.File[]) {
        try {
            console.log('DTO received:', dto);
            console.log('Files received:', files ? files.length : 0);

            let imageUrl = '';
            let imageUrls: string[] = [];

            if (files && files.length > 0) {
                // Sube todas las imágenes en paralelo
                imageUrls = await Promise.all(
                    files.map(file => this.supabaseService.uploadImage(file))
                );

                // La primera imagen sigue siendo la principal para compatibilidad
                imageUrl = imageUrls[0];
                console.log('Images uploaded to Supabase:', imageUrls);
            }

            // Si se proporciona stockBySize, sincronizamos el stock total
            let totalStock = dto.stock;
            if (dto.stockBySize) {
                totalStock = Object.values(dto.stockBySize).reduce((acc, val) => acc + val, 0);
            }

            const product = this.productRepository.create({
                ...dto,
                stock: totalStock,
                image: imageUrl,
                images: imageUrls,
            });

            const savedProduct = await this.productRepository.save(product);
            console.log('Product saved to DB:', savedProduct);

            // Re-fetch with relations to ensure category name is returned to frontend
            return await this.findOne(savedProduct.id);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async update(id: string, dto: UpdateProductDto) {
        console.log('--- UPDATE PRODUCT (JSON) START ---');
        console.log('ID:', id);

        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');

        // Determinar la lista de imágenes actual
        if (dto.existingImages !== undefined) {
            product.images = Array.isArray(dto.existingImages) ? dto.existingImages : [dto.existingImages];
            product.image = product.images[0] || "";
        }

        // Actualizar el resto de campos
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { existingImages, image, images, ...otherData } = dto as any;
        Object.assign(product, otherData);

        // Si se actualizó stockBySize, sincronizamos el stock total
        if (dto.stockBySize) {
            product.stock = Object.values(dto.stockBySize).reduce((acc: number, val: number) => acc + val, 0);
        }

        const updatedProduct = await this.productRepository.save(product);
        console.log('--- UPDATE PRODUCT (JSON) END ---');

        return await this.findOne(updatedProduct.id);
    }

    async uploadImages(id: string, files: Express.Multer.File[]) {
        console.log('--- UPLOAD IMAGES START ---');
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');

        if (files && files.length > 0) {
            console.log('Uploading new files to Supabase...', files.length);
            const newImageUrls = await Promise.all(
                files.map(file => this.supabaseService.uploadImage(file))
            );

            // Append new images to existing ones
            const currentImages = product.images || [];
            const completeGallery = [...currentImages, ...newImageUrls];

            product.images = completeGallery;
            product.image = completeGallery[0] || product.image;

            await this.productRepository.save(product);
            console.log('Images appended to product successfully.');
        }

        console.log('--- UPLOAD IMAGES END ---');
        return await this.findOne(id);
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