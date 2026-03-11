import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { AdminGuard } from '../auth/admin.guard';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(@Query() query: any): Promise<Product[]> {
        return this.productsService.findAll(query);
    }

    @Get('template/download')
    downloadTemplate(@Res() res: Response) {
        const headers = 'Name,Storage,Category,Sub-Category,Tags,Size,Weight,UnitPrice,UnitPack,PackPricing\n';
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products_template.csv');
        return res.send(headers);
    }

    @Get('categories')
    async getCategories() {
        return [
            { id: 'frozen', name: 'Frozen' },
            { id: '5min', name: '5 Mins' },
            { id: '10min', name: '10 Mins' },
            { id: 'meat', name: 'Meat' },
            { id: 'dessert', name: 'Dessert' }
        ];
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(+id);
    }

    @Post()
    @UseGuards(AdminGuard)
    create(@Body() createProductDto: any): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Post('bulk-upload')
    @UseGuards(AdminGuard)
    async bulkUpload(@Body() products: any[]): Promise<{ count: number }> {
        for (const product of products) {
            await this.productsService.create(product);
        }
        return { count: products.length };
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() updateProductDto: any): Promise<Product> {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(+id);
    }
}
