import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT || 8000);
  console.log('API Gateway running on port 8000');
}
bootstrap();
