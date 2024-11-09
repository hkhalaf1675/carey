import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = parseInt((configService.get('port') ?? '3666'), 10);
  await app.listen(port);
}
bootstrap();
