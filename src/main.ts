import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = parseInt((configService.get('port') ?? '3666'), 10);
  await app.listen(port);
}
bootstrap();
