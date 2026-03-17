import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

import { OrdersGateway } from './orders.gateway';
import { ShipdayService } from './shipday.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private ordersGateway: OrdersGateway,
        private shipdayService: ShipdayService,
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

        // Notify Store
        this.ordersGateway.notifyNewOrder(savedOrder.storeId, savedOrder);

        // If order is CONFIRMED, sync to Shipday for delivery
        if (status === OrderStatus.CONFIRMED) {
            this.shipdayService.createOrder(savedOrder);
        }

        return savedOrder;
    }
}
