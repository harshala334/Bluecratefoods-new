import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class AppModule { }

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Port 8006 for Delivery Service
    await app.listen(8006);
    console.log(`Delivery Service (Placeholder) listening on port 8006`);
}
bootstrap();
