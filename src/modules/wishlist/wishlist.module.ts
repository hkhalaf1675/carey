import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from 'src/database/entities/Wishlist.entity';
import { Car } from 'src/database/entities/Car.entity';
import { User } from 'src/database/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Car, User])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
