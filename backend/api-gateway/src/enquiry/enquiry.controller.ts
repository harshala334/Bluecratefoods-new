import { Controller, Post, Body } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { Enquiry } from './enquiry.entity';

@Controller('enquiry')
export class EnquiryController {
    constructor(private readonly enquiryService: EnquiryService) { }

    @Post()
    async create(@Body() enquiryData: Partial<Enquiry>) {
        const result = await this.enquiryService.create(enquiryData);
        return result;
    }
}
