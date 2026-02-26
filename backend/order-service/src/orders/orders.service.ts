import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private ordersGateway: OrdersGateway,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
        const order = this.ordersRepository.create({
            ...createOrderDto,
            userId,
            status: OrderStatus.PENDING,
        });
        const savedOrder = await this.ordersRepository.save(order);

        // Notify Store
        this.ordersGateway.notifyNewOrder(savedOrder.storeId, savedOrder);

        return savedOrder;
    }

    async findAllByUserId(userId: string): Promise<Order[]> {
        return this.ordersRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findAllByStoreId(storeId: string): Promise<Order[]> {
        return this.ordersRepository.find({ where: { storeId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Order> {
        return this.ordersRepository.findOne({ where: { id } });
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        const order = await this.findOne(id);
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        const savedOrder = await this.ordersRepository.save(order);

        // We could also notify the user here via a similar gateway method if needed
        // this.ordersGateway.notifyOrderStatusUpdate(savedOrder.userId, savedOrder);

        return savedOrder;
    }
}
