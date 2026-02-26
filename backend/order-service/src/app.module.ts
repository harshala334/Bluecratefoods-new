import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USER || 'bluecrate',
            password: process.env.DB_PASS || 'bluecratepass',
            database: process.env.DB_NAME || 'order_service_db',
            entities: [Order],
            synchronize: true, // Auto-create tables for dev
            ssl: process.env.DB_HOST?.includes('ondigitalocean')
                ? {
                    rejectUnauthorized: false // For simple setup with DO Managed DB without custom CA
                }
                : false,
        }),
        OrdersModule,
    ],
})
export class AppModule { }
