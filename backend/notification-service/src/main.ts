import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class AppModule { }

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Port 8008 for Notification Service
    await app.listen(8008);
    console.log(`Notification Service (Placeholder) listening on port 8008`);
}
bootstrap();
