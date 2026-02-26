import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, ParseFilePipe, MaxFileSizeValidator, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

/**
 * Handles file uploads
 */
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(), // Use memory storage for GCS upload
    }))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                ],
                errorHttpStatusCode: HttpStatus.PAYLOAD_TOO_LARGE,
            }),
        ) file: Express.Multer.File
    ) {
        if (!file) return { error: 'No file uploaded' };

        const url = await this.uploadService.uploadFile(file);

        return {
            success: true,
            url: url,
            originalName: file.originalname,
        };
    }
}
