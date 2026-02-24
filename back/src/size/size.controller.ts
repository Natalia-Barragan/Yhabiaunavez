import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sizes')
@Controller('sizes')
export class SizeController {
    constructor(private readonly sizeService: SizeService) { }

    @ApiOperation({ summary: 'Create a new size' })
    @Post()
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
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSizeDto: UpdateSizeDto) {
        return this.sizeService.update(id, updateSizeDto);
    }

    @ApiOperation({ summary: 'Delete a size' })
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.sizeService.remove(id);
    }
}
