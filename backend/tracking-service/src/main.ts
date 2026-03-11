import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class AppModule { }

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Port 8007 for Tracking Service
    await app.listen(process.env.PORT || 8007);
    console.log(`Tracking Service (Placeholder) listening on port 8007`);
}
bootstrap();
