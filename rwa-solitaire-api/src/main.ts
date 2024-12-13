import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://localhost:4200'
    ]
  });
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
