import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        // TODO: Extract userId from request auth token
        const mockUserId = 'user-123';
        return this.ordersService.create(createOrderDto, mockUserId);
    }

    @Get('mine')
    async findMyOrders() {
        const mockUserId = 'user-123';
        return this.ordersService.findAllByUserId(mockUserId);
    }

    @Get('store/:storeId')
    findByStore(@Param('storeId') storeId: string) {
        return this.ordersService.findAllByStoreId(storeId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
        return this.ordersService.updateStatus(id, status);
    }
}
