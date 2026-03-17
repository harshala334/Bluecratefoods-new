import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DriverApplication } from './driver-application.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DriverApplication])],
    providers: [DeliveryService],
    controllers: [DeliveryController],
    exports: [DeliveryService],
})
export class DeliveryModule { }
