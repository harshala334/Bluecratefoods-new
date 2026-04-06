import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Res, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { AdminGuard } from '../auth/admin.guard';
import { Response, Request } from 'express';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(@Query() query: any, @Req() req: Request): Promise<Product[]> {
        return this.productsService.findAll(query, (req as any).user);
    }

    @Get('last-updated')
    getLastUpdated(): Promise<{ lastUpdated: Date }> {
        return this.productsService.getLastUpdated();
    }

    @Get('template/download')
    downloadTemplate(@Res() res: Response) {
        const headers = 'Name,Storage,Category,Sub-Category,Tags,Size,Weight,UnitPrice,UnitPack,PackPricing\n';
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products_template.csv');
        return res.send(headers);
    }

    @Get('categories')
    async getCategories(@Req() req: Request) {
        const categories = [
            { id: 'frozen', name: 'Frozen' },
            { id: '5min', name: '5 Mins' },
            { id: '10min', name: '10 Mins' },
            { id: 'meat', name: 'Meat' },
            { id: 'veg', name: 'Vegetables' },
            { id: 'grocery', name: 'Grocery' },
            { id: 'kitchen', name: 'Kitchen' },
            { id: 'dessert', name: 'Dessert' },
            { id: 'packaging', name: 'Packaging Materials' }
        ];

        const user = (req as any).user;
        if (user && user.userType === 'vendor' && user.vendorCategory) {
            return categories.filter(c => c.id === user.vendorCategory);
        }
        return categories;
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(+id);
    }

    @Post()
    @UseGuards(AdminGuard)
    create(@Body() createProductDto: any, @Req() req: Request): Promise<Product> {
        return this.productsService.create(createProductDto, (req as any).user);
    }

    @Post('bulk-upload')
    @UseGuards(AdminGuard)
    async bulkUpload(@Body() products: any[], @Req() req: Request): Promise<{ count: number }> {
        for (const product of products) {
            await this.productsService.create(product, (req as any).user);
        }
        return { count: products.length };
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() updateProductDto: any, @Req() req: Request): Promise<Product> {
        return this.productsService.update(+id, updateProductDto, (req as any).user);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(+id);
    }
}
