import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/entities/store.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USER || 'bluecrate',
            password: process.env.DB_PASS || 'bluecratepass',
            database: process.env.DB_NAME || 'store_service_db',
            entities: [Store],
            synchronize: true, // Auto-create tables for dev
        }),
        StoresModule,
    ],
})
export class AppModule { }
