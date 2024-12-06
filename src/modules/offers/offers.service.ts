import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from 'src/database/entities/Offer.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';
import { User } from 'src/database/entities/User.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>
  ){}

  async create(createOfferDto: CreateOfferDto) {
    const car = await this.carRepository.findOneBy({id: createOfferDto.carId});
    if(!car){
      throw new NotFoundException(new FailResponseDto(
        ['There is no car with this id'],
        'Validation error',
        404
      ));
    }

    createOfferDto.car = car;
    delete createOfferDto.carId;

    await this.offerRepository.save(createOfferDto);

    return new SuccessResponseDto(
      'Offer has been added successfully',
      null,
      201
    );
  }

  async findAll(query: any) {
    const response = await this.getOffers(query);
    return response;
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: {id},
      relations: {
        car: {
          attachments: true,
          brand: true,
          user: true
        }
      },
      select: {
        id: true,
        type: true,
        discount: true,
        description: true,
        car: {
          id: true,
          name: true,
          type: true,
          price: true,
          brand: {
            id: true,
            name: true,
            image: true
          },
          attachments: {
            id: true,
            url: true,
            type: true
          },
          user: {
            id: true,
            fullName: true,
            email: true,
            picture: true
          }
        }
      }
    });

    return new SuccessResponseDto(
      '',
      { offer },
      200
    );
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offerRepository.findOneBy({id});
    if(!offer){
      throw new NotFoundException(new FailResponseDto(
        ['There is no offers with this id'],
        'Validation error',
        404
      ));
    }

    if(updateOfferDto.carId){
      const car = await this.carRepository.findOneBy({id: updateOfferDto.carId});
      if(!car){
        throw new NotFoundException(new FailResponseDto(
          ['There is no car with this id'],
          'Validation error',
          404
        ));
      }

      updateOfferDto.car = car;
      delete updateOfferDto.carId;
    }

    await this.offerRepository.update({id}, updateOfferDto);

    return new SuccessResponseDto(
      'offer has been updated successfully',
      null,
      200
    );
  }

  async remove(id: number) {
    const offer = await this.offerRepository.findOneBy({id});
    if(!offer){
      throw new NotFoundException(new FailResponseDto(
        ['There is no offers with this id'],
        'Validation error',
        404
      ));
    }

    await this.offerRepository.remove(offer);

    return new SuccessResponseDto(
      'offer has been deleted successfully',
      null,
      200
    );
  }

  async findMyOffers(query: any, user: User){
    const response = await this.getOffers({...query, userId: user.id});
    return response;
  }

  async getOffers(query: any){
    const { carId, userId, page, perPage } = query;
    let filter: FindOptionsWhere<Offer> = {};
    if(carId){
      filter.car = {id: carId};
    }
    if(userId){
      filter.car = { user: { id: userId }};
    }

    const pagnationQuery = {
      where: filter,
      relations: {
        car: {
          attachments: true,
          user: true
        }
      },
      select: {
        id: true,
        type: true,
        discount: true,
        description: true,
        car: {
          id: true,
          name: true,
          type: true,
          price: true,
          attachments: {
            id: true,
            url: true,
            type: true
          },
          user: {
            id: true
          }
        }
      }
    };

    const options = {
      page,
      perPage
    };

    const response = await pagnationService(Offer, pagnationQuery, options);
    return response;
  }
}
