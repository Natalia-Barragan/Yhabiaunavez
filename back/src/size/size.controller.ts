import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Sizes')
@Controller('sizes')
export class SizeController {
    constructor(private readonly sizeService: SizeService) { }

    @ApiOperation({ summary: 'Create a new size' })
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createSizeDto: CreateSizeDto) {
        return this.sizeService.create(createSizeDto);
    }

    @ApiOperation({ summary: 'Get all sizes' })
    @Get()
    findAll() {
        return this.sizeService.findAll();
    }

    @ApiOperation({ summary: 'Get a size by ID' })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.sizeService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a size' })
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSizeDto: UpdateSizeDto) {
        return this.sizeService.update(id, updateSizeDto);
    }

    @ApiOperation({ summary: 'Delete a size' })
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.sizeService.remove(id);
    }
}
