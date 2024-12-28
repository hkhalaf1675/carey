import { Module } from '@nestjs/common';
import { RateReactsService } from './rate-reacts.service';
import { RateReactsController } from './rate-reacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateReact } from 'src/database/entities/RateReact.entity';
import { Rate } from 'src/database/entities/Rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RateReact, Rate])],
  controllers: [RateReactsController],
  providers: [RateReactsService],
})
export class RateReactsModule {}
