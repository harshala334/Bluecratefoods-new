import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors();
    await app.listen(8004); // Port 8004 for Store Service
}
bootstrap();
