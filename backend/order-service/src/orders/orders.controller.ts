import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto, @Query('userId') userId?: string) {
        // In real app, extract from JWT. For now, take from query or default
        const actualUserId = userId || 'user-123';
        return this.ordersService.create(createOrderDto, actualUserId);
    }

    @Get('mine')
    async findMyOrders(@Query('userId') userId?: string) {
        const actualUserId = userId || 'user-123';
        return this.ordersService.findAllByUserId(actualUserId);
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
