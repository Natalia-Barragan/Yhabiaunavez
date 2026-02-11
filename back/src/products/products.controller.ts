import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseUUIDPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // 1. Crear producto con imagen
    @ApiOperation({ summary: 'Create a new product with image upload' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'integer' },
                categoryId: { type: 'string', format: 'uuid' },
            },
        },
    })
    @Post()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'integer' },
                categoryId: { type: 'string', format: 'uuid' },
                image: { type: 'string', format: 'binary' },
                sizes: {
                    type: 'array',
                    items: { type: 'string' } // Esto obliga a Swagger a mostrar el campo
                },
            },
        },
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createProductDto: CreateProductDto
    ) {
        return this.productsService.create(createProductDto, file);
    }

    @ApiOperation({ summary: 'Get all products' })
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    // 3. Obtener un producto por ID (UUID)
    @ApiOperation({ summary: 'Get a product by ID' })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.findOne(id);
    }

    // 4. Actualizar producto (imagen opcional)
    @ApiOperation({ summary: 'Update a product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'integer' },
                categoryId: { type: 'string', format: 'uuid' },
            },
        },
    })
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.productsService.update(id, updateProductDto, file);
    }

    // 5. Eliminar producto
    @ApiOperation({ summary: 'Delete a product' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.remove(id);
    }
}