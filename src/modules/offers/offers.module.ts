import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { Offer } from 'src/database/entities/Offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Offer])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
