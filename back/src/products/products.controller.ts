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
    UploadedFiles,
    ParseUUIDPipe,
    UseGuards
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
            },
        },
    })
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createProductDto: CreateProductDto
    ) {
        return this.productsService.create(createProductDto, files);
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

    // 4. Actualizar producto (datos generales JSOn)
    @ApiOperation({ summary: 'Update a product information' })
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    // 4.5. Subir imágenes a un producto existente
    @ApiOperation({ summary: 'Upload images to an existing product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' }
                }
            },
        },
    })
    @Post(':id/images')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    uploadImages(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.productsService.uploadImages(id, files);
    }

    // 5. Eliminar producto
    @ApiOperation({ summary: 'Delete a product' })
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.remove(id);
    }
}