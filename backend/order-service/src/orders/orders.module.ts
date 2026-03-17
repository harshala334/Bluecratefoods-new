import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';

import { OrdersGateway } from './orders.gateway';
import { ShipdayService } from './shipday.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersGateway, ShipdayService],
    exports: [OrdersService, ShipdayService],
})
export class OrdersModule { }
