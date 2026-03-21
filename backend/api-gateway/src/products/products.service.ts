import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async findAll(query?: any, user?: any): Promise<Product[]> {
        console.log(`[ProductsService.findAll] Incoming request. User: ${user ? user.email : 'ANONYMOUS'}, Query: ${JSON.stringify(query)}`);
        const qb = this.productsRepository.createQueryBuilder('product');

        if (query?.category) {
            const category = query.category.toLowerCase();
            qb.andWhere('(LOWER(product.category) = :category OR product.secondaryCategories @> :jsonCategory)', { 
                category,
                jsonCategory: JSON.stringify([category])
            });
        }

        if (query?.search) {
            const searchLower = `%${query.search.toLowerCase()}%`;
            qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search OR LOWER(product.category) LIKE :search)', { search: searchLower });
        }

        // If user is a vendor, restrict to their category
        if (user && user.userType === 'vendor' && user.vendorCategory) {
            console.log(`[ProductsService] Filtering for vendor: ${user.email}, Category: ${user.vendorCategory}`);
            qb.andWhere('product.category = :vendorCat', { vendorCat: user.vendorCategory });
        } else if (user && user.userType === 'vendor') {
            console.warn(`[ProductsService] Vendor user ${user.email} has NO vendorCategory!`);
            // To be safe, if a vendor has no category assigned, they should see NO products
            qb.andWhere('1=0');
        }

        qb.andWhere('product.isApproved = :isApproved', { isApproved: true });

        // Hide inactive products unless admin parameter is provided
        if (query?.admin !== 'true') {
            qb.andWhere('product.isActive = :isActive', { isActive: true });
        }

        return qb.orderBy('product.createdAt', 'DESC').getMany();
    }

    async findOne(id: number): Promise<Product> {
        return this.productsRepository.findOne({ where: { id } });
    }

    async create(createProductDto: any, user?: any): Promise<Product> {
        // Force category for vendors
        if (user && user.userType === 'vendor' && user.vendorCategory) {
            createProductDto.category = user.vendorCategory;
        }

        if (createProductDto.stockQuantity !== undefined && createProductDto.stockQuantity <= 0) {
            createProductDto.inStock = false;
        }
        if (createProductDto.inStock === false) {
            createProductDto.stockQuantity = 0;
        }
        const product = this.productsRepository.create(createProductDto as object);
        return this.productsRepository.save(product as any);
    }

    async update(id: number, updateProductDto: any, user?: any): Promise<Product> {
        // Prevent vendors from changing category to something else
        if (user && user.userType === 'vendor' && user.vendorCategory) {
            updateProductDto.category = user.vendorCategory;
        }

        if (updateProductDto.stockQuantity !== undefined && updateProductDto.stockQuantity <= 0) {
            updateProductDto.inStock = false;
        }
        if (updateProductDto.inStock === false) {
            updateProductDto.stockQuantity = 0;
        }
        await this.productsRepository.update(id, updateProductDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }
}
