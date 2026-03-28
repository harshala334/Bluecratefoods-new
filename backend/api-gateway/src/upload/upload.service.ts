import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';

@Injectable()
export class UploadService {
    private storage: Storage;
    private bucketName = 'bluecrate-uploads-491614'; // Updated for migration

    constructor() {
        // Automatically picks up credentials from Workload Identity or GOOGLE_APPLICATION_CREDENTIALS
        this.storage = new Storage();
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        try {
            // Generate unique filename
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            const filename = `${randomName}${extname(file.originalname)}`;

            const bucket = this.storage.bucket(this.bucketName);
            const blob = bucket.file(filename);

            // Create a stream to upload
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    console.error('GCS Upload Error:', err);
                    reject(new HttpException('Failed to upload to GCS', HttpStatus.INTERNAL_SERVER_ERROR));
                });

                blobStream.on('finish', () => {
                    // Since we made the bucket public via Terraform (allUsers: objectViewer),
                    // we can just return the public URL.
                    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
                    resolve(publicUrl);
                });

                blobStream.end(file.buffer);
            });
        } catch (error) {
            console.error('Upload Service Error:', error);
            throw new HttpException('Upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
