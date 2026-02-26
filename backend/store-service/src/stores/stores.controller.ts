import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    @Post()
    create(@Body() createStoreDto: CreateStoreDto) {
        return this.storesService.create(createStoreDto);
    }

    @Get()
    findAll() {
        return this.storesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const store = await this.storesService.findOne(id);
        if (!store) {
            throw new NotFoundException(`Store with ID ${id} not found`);
        }
        return store;
    }
}
