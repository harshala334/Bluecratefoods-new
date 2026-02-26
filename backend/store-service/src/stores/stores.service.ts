import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private storesRepository: Repository<Store>,
    ) { }

    async create(createStoreDto: CreateStoreDto): Promise<Store> {
        const store = this.storesRepository.create(createStoreDto);
        return this.storesRepository.save(store);
    }

    async findOne(id: string): Promise<Store> {
        return this.storesRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Store[]> {
        return this.storesRepository.find();
    }
}
