import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await AppDataSource.initialize();
  console.log("Database connected");
  await app.listen(8001);
  console.log('Auth service running on port 8001');
}
bootstrap();
