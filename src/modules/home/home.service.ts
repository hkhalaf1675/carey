import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';
import { Attachment } from 'src/database/entities/Attachment.entity';
import { Brand } from 'src/database/entities/Brand.entity';
import { Car } from 'src/database/entities/Car.entity';
import { User } from 'src/database/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>
  ){}

  async findAll(user: User) {
    const brands = await pagnationService(
      Brand, 
      {
        select: ['id', 'name', 'image'],
        order: { id: 'DESC' }
      }, 
      {page: 1, perPage: 20}
    );

    const bestOffers = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.attachments', 'attachments')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.rates', 'rate')
      .leftJoinAndSelect('car.colors', 'colors')
      .leftJoinAndSelect('car.wishlists', 'wishlists', 'wishlists.userId = :userId', { userId: user.id})
      .groupBy('car.id')
      .orderBy('price', 'ASC')
      .limit(25)
      .getMany();

    const bestCars = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.attachments', 'attachments')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.rates', 'rate')
      .leftJoinAndSelect('car.colors', 'colors')
      .leftJoinAndSelect('car.wishlists', 'wishlists', 'wishlists.userId = :userId', { userId: user.id})
      .addSelect('SUM(rate.rate)', 'totalRatings')
      .groupBy('car.id')
      .orderBy('totalRatings', 'DESC')
      .limit(25)
      .getMany();

    return new SuccessResponseDto(
      '',
      {
        brands: brands.data, 
        bestOffers,
        bestCars
      },
      200
    );
  }

}
