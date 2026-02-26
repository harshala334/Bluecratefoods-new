import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors();
    await app.listen(8003, '0.0.0.0'); // Port 8003 for Order Service
}
bootstrap();
