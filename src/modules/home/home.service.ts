import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';
import { Attachment } from 'src/database/entities/Attachment.entity';
import { Brand } from 'src/database/entities/Brand.entity';
import { Car } from 'src/database/entities/Car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>
  ){}

  async findAll() {
    const brands = await pagnationService(
      Brand, 
      {
        select: ['id', 'name', 'image'],
        order: { id: 'DESC' }
      }, 
      {page: 1, perPage: 20}
    );

    const bestOffers = await pagnationService(
      Car,
      {
        relations: ['brand', 'attachments', 'rates', 'colors'],
        select: {
          id: true,
          name: true,
          price: true,
          type: true,
          brand: {
            id: true,
            name: true
          },
          attachments: {
            id: true,
            type: true,
            url: true
          },
          rates: {
            id: true,
            rate: true
          }
        },
        order: {
          price: 'ASC'
        }
      },
      { page: 1, perPage: 25 }
    );

    const bestCarsQuery = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.attachments', 'attachments')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.rates', 'rate')
      .leftJoinAndSelect('car.colors', 'colors')
      .addSelect('SUM(rate.rate)', 'totalRatings')
      .groupBy('car.id')
      .orderBy('totalRatings', 'DESC')
      .limit(25);

    const bestCars = await bestCarsQuery.getMany();

    return new SuccessResponseDto(
      '',
      {
        brands: brands.data, 
        bestOffers: bestOffers.data, 
        bestCars
      },
      200
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} home`;
  }

}
