import { Controller, Post, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DriverApplication } from './driver-application.entity';
import { AdminGuard } from '../auth/admin.guard';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) { }

    @Post('apply')
    async apply(@Body() data: Partial<DriverApplication>) {
        return this.deliveryService.apply(data);
    }

    @Get('applications')
    @UseGuards(AdminGuard)
    async getApplications() {
        return this.deliveryService.findAll();
    }

    @Put('applications/:id/approve')
    @UseGuards(AdminGuard)
    async approveApplication(@Param('id') id: string) {
        return this.deliveryService.approve(parseInt(id));
    }

    @Put('applications/:id/reject')
    @UseGuards(AdminGuard)
    async rejectApplication(@Param('id') id: string) {
        return this.deliveryService.reject(parseInt(id));
    }
}
