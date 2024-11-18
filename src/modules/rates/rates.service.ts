import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThanOrEqual, Repository } from 'typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { Rate } from 'src/database/entities/Rate.entity';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';
import { User } from 'src/database/entities/User.entity';

@Injectable()
export class RatesService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>
  ){}

  async create(createRateDto: CreateRateDto, user: User) {
    const car = await this.carRepository.findOneBy({id: createRateDto.carId});
    if(!car){
      throw new BadRequestException(new FailResponseDto(
        ['There is no car with this id'],
        'Validation error!',
        400
      ));
    }

    const rate = this.rateRepository.create({
      rate: createRateDto.rate,
      comment: createRateDto.comment,
      car: car,
      user
    });

    await this.rateRepository.save(rate);

    return new SuccessResponseDto(
      'Car has been updated successfully',
      null,
      201
    );
  }

  async findAll(query: any) {
    const response = await this.getRates(query);
    return response;
  }

  async remove(id: number, user: User) {
    const rate = await this.rateRepository.findOne({
      where: { id },
      relations: {
        user: true
      }
    });

    if(!rate){
      throw new BadRequestException(new FailResponseDto(
        ['There is no rates with this id'],
        'Validation error!',
        400
      ));
    }

    if(user.id !== rate.user.id){
      throw new UnauthorizedException(new FailResponseDto(
        ['You can not delete this rate!'],
        'Unauthorized',
        401
      ));
    }

    await this.rateRepository.remove(rate);

    return new SuccessResponseDto(
      'rate has been removed successfully',
      null,
      200
    );
  }

  async findMyRates(query: any, user: User) {
    const response = await this.getRates({...query, userId: user.id});
    return response;
  }

  private async getRates(query: any) {
    const { page, perPage, rate, carId, userId } = query;

    const filter: FindOptionsWhere<Rate> = {};
    if(rate){
      filter.rate = MoreThanOrEqual(rate);
    }
    if(carId){
      filter.car = { id: carId }
    }
    if(userId){
      filter.user = { id: userId }
    }

    const pagnationQuery = {
      where: filter,
      relations: ['user', 'car'],
      select: {
        id: true,
        rate: true,
        comment: true,
        createdAt: true,
        user: {
          id: true,
          fullName: true,
          nickName: true
        },
        car: {
          id: true
        }
      }
    }

    const options = {
      page, perPage
    }

    const response = await pagnationService(Rate, pagnationQuery, options);
    return response;
  }
}
