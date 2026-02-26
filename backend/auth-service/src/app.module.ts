import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseFixService } from './database-fix.service';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || process.env.DB_USERNAME || 'bluecrate',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || 'bluecratepass',
      database: process.env.DB_NAME || process.env.DB_DATABASE || 'auth_service_db',
      entities: [User],
      synchronize: true, // Auto-create tables (dev only)
      ssl: process.env.DB_HOST?.includes('ondigitalocean')
        ? { rejectUnauthorized: false }
        : false,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseFixService, FirebaseService],
})
export class AppModule { }
