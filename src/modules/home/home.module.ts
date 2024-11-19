import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { Brand } from 'src/database/entities/Brand.entity';
import { Attachment } from 'src/database/entities/Attachment.entity';
import { Rate } from 'src/database/entities/Rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, Brand, Attachment, Rate])
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
