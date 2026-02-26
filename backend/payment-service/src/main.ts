import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class AppModule { }

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Port 8005 for Payment Service
    await app.listen(8005);
    console.log(`Payment Service (Placeholder) listening on port 8005`);
}
bootstrap();
