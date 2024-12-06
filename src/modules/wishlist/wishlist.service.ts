import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/database/entities/Wishlist.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { User } from 'src/database/entities/User.entity';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const car = await this.carRepository.findOneBy({id: createWishlistDto.carId});
    if(!car){
      throw new NotFoundException(new FailResponseDto(
        ['There is no car with this id'],
        'Validation error',
        404
      ));
    }

    const oldItems = await this.wishlistRepository.find({
      where: {
        car: { id: car.id },
        user: { id: user.id }
      }
    });

    if(oldItems && oldItems.length > 0){
      throw new BadRequestException(new FailResponseDto(
        ['This is already exists in the wishlist'],
        'Validation error',
        404
      ));
    }

    await this.wishlistRepository.save({car, user});

    return new SuccessResponseDto(
      'Car has been added successfully to the wishlist',
      null,
      201
    );
  }

  async findMyWishlist(user: User, query: any) {
    const { carName, page, perPage } = query;
    let filter: FindOptionsWhere<Wishlist> = {};
    if(carName){
      filter.car = {name: Like(`%${carName}%`)};
    }
    filter.user = { id: user.id };

    const pagnationQuery = {
      where: filter,
      relations: {
        car: {
          attachments: true
        },
        user: true
      },
      select: {
        id: true,
        car: {
          id: true,
          name: true,
          type: true,
          price: true,
          attachments: {
            id: true,
            url: true,
            type: true
          }
        },
        user: {
          id: true
        }
      }
    };

    const options = {
      page,
      perPage
    };

    const response = await pagnationService(Wishlist, pagnationQuery, options);
    return response;
  }

  async remove(id: number, user: User) {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: {id},
      relations: {user: true}
    });

    if(!wishlistItem){
      throw new NotFoundException(new FailResponseDto(
        ['There is no wishlist item with this id'],
        'Validation error',
        404
      ));
    }

    if(wishlistItem.user.id !== user.id){
      throw new UnauthorizedException(new FailResponseDto(
        ['You can not delete that item'],
        'Validation error',
        401
      ));
    }

    await this.wishlistRepository.remove(wishlistItem);

    return new SuccessResponseDto(
      'Car has been removed successfully from the wishlist',
      null,
      200
    );
  }
}