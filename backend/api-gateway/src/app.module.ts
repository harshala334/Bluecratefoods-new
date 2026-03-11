import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnquiryModule } from './enquiry/enquiry.module';
import { Enquiry } from './enquiry/enquiry.entity';
import { AuthProxyController } from './auth/auth-proxy.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import * as fs from 'fs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from './upload/upload.module';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/recipe.entity';

import { OrdersProxyController } from './orders/orders-proxy.controller';

import { UsersProxyController } from './users/users-proxy.controller';
import { StoresProxyController } from './stores/stores-proxy.controller';

import { LocationModule } from './location/location.module';
import { ProductsModule } from './products/products.module';
import { Product as ProductEntity } from './products/product.entity';

@Module({
  imports: [
    // ...
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LocationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serve from public folder
      serveRoot: '/public', // Access via /public/...
    }),
    UploadModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '136.114.139.164',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'bluecrate',
      password: process.env.DB_PASS || process.env.DB_PASSWORD || 'bluecratepass',
      database: process.env.DB_NAME || 'bluecrate_db',
      entities: [Enquiry, Recipe, ProductEntity],
      synchronize: true, // Auto-create tables (dev only)
      ssl: false,
    }),
    EnquiryModule,
    RecipesModule,
    ProductsModule,
    /*
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
          },
          consumer: {
            groupId: 'api-gateway-consumer'
          }
        }
      }
    ])
    */
  ],
  controllers: [HealthController, AuthProxyController, OrdersProxyController, UsersProxyController, StoresProxyController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
