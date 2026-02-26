import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { Enquiry } from './enquiry.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Enquiry])],
    controllers: [EnquiryController],
    providers: [EnquiryService],
})
export class EnquiryModule { }
