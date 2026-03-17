import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverApplication, ApplicationStatus } from './driver-application.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DeliveryService {
    private readonly shipdayApiKey: string;
    private readonly shipdayBaseUrl = 'https://api.shipday.com';

    constructor(
        @InjectRepository(DriverApplication)
        private applicationRepository: Repository<DriverApplication>,
        private configService: ConfigService,
    ) {
        this.shipdayApiKey = this.configService.get<string>('SHIPDAY_API_KEY');
    }

    async apply(data: Partial<DriverApplication>): Promise<DriverApplication> {
        const application = this.applicationRepository.create({
            ...data,
            status: ApplicationStatus.PENDING,
        });
        return this.applicationRepository.save(application);
    }

    async findAll(): Promise<DriverApplication[]> {
        return this.applicationRepository.find({ order: { createdAt: 'DESC' } });
    }

    async approve(id: number): Promise<DriverApplication> {
        const application = await this.applicationRepository.findOne({ where: { id } });
        if (!application) {
            throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
        }

        if (application.status === ApplicationStatus.APPROVED) {
            throw new HttpException('Already approved', HttpStatus.BAD_REQUEST);
        }

        // 1. Create Carrier in Shipday
        try {
            if (this.shipdayApiKey) {
                await axios.post(
                    `${this.shipdayBaseUrl}/carriers`,
                    {
                        name: application.name,
                        email: application.email,
                        phoneNumber: application.phone,
                    },
                    {
                        headers: {
                            Authorization: `Basic ${this.shipdayApiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );
            } else {
                console.warn('SHIPDAY_API_KEY not found. Skipping Shipday sync.');
            }
        } catch (error) {
            console.error('Shipday Sync Error:', error.response?.data || error.message);
            throw new HttpException(
                `Failed to sync with Shipday: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        // 2. Update local status
        application.status = ApplicationStatus.APPROVED;
        return this.applicationRepository.save(application);
    }

    async reject(id: number): Promise<DriverApplication> {
        const application = await this.applicationRepository.findOne({ where: { id } });
        if (!application) {
            throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
        }
        application.status = ApplicationStatus.REJECTED;
        return this.applicationRepository.save(application);
    }
}
