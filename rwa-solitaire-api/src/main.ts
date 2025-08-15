import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://localhost:4200',
      // docker
      'http://rwa-solitaire:4200',
      'https://rwa-solitaire:4200',
      'http://rwa-solitaire-db:5432',
      'https://rwa-solitaire-db:5432',
    ],
    credentials: true
  });
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.NEST_PORT ?? 3000);
}
bootstrap();
