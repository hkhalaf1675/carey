import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rate } from 'src/database/entities/Rate.entity';
import { Car } from 'src/database/entities/Car.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, Rate])
  ],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
