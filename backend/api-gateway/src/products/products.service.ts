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

    async findAll(query?: any): Promise<Product[]> {
        const qb = this.productsRepository.createQueryBuilder('product');

        if (query?.category) {
            qb.andWhere('product.category = :category', { category: query.category });
        }

        if (query?.search) {
            const searchLower = `%${query.search.toLowerCase()}%`;
            qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search)', { search: searchLower });
        }

        qb.andWhere('product.isApproved = :isApproved', { isApproved: true });

        return qb.orderBy('product.createdAt', 'DESC').getMany();
    }

    async findOne(id: number): Promise<Product> {
        return this.productsRepository.findOne({ where: { id } });
    }

    async create(createProductDto: any): Promise<Product> {
        const product = this.productsRepository.create(createProductDto as object);
        return this.productsRepository.save(product as any);
    }

    async update(id: number, updateProductDto: any): Promise<Product> {
        await this.productsRepository.update(id, updateProductDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }
}
