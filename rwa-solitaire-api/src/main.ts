import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());
    app.enableCors({
    origin: [
      // docker
      'http://rwa-solitaire:4200',
      'https://rwa-solitaire:4200',
      'http://rwa-solitaire-db:5432',
      'https://rwa-solitaire-db:5432',

      // regular
      'http://localhost:4200',
      'https://localhost:4200',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    preflightContinue: false,
    optionsSuccessStatus: 204

  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
      excludeExtraneousValues: false,
    }
  }));
  await app.listen(process.env.NEST_PORT ?? 3000);
}
bootstrap();
