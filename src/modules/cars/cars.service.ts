import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrderProperty, FindOptionsWhere, LessThanOrEqual, Like, Repository } from 'typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { Brand } from 'src/database/entities/Brand.entity';
import { Attachment } from 'src/database/entities/Attachment.entity';
import { ConfigService } from '@nestjs/config';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { User } from 'src/database/entities/User.entity';
import { pagnationService } from 'src/common/services/pagnationService';
import { Rate } from 'src/database/entities/Rate.entity';
import { Color } from 'src/database/entities/Color.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    private readonly configService: ConfigService
  ){}

  async create(createCarDto: CreateCarDto, files: Express.Multer.File[], user: User) {
    const brand = await this.brandRepository.findOneBy({id: createCarDto.brandId});
    if(!brand){
      throw new BadRequestException(new FailResponseDto(
        ['There is no brand with this id'],
        'Validation error!',
        400
      ));
    }

    if(!files || files.length === 0){
      throw new BadRequestException(new FailResponseDto(
        ['Please enter at least one image for the car'],
        'Validation error!',
        400
      ));
    }

    createCarDto.brand = brand;
    createCarDto.user = user;

    const car = await this.carRepository.save(createCarDto);

    let attachments: Attachment[] = [];
    let prefixPath= this.configService.get<string>('prefixPath');
    files.forEach(file => {
      attachments.push(this.attachmentRepository.create({
        url: `${prefixPath}/uploads/cars/${file.filename}`,
        type: file.mimetype.startsWith('video') ? 'video' : 'image',
        car
      }));
    });

    await this.attachmentRepository.save(attachments);

    if(createCarDto.carColors.length > 0){
      let colors = [];
      createCarDto.carColors.forEach(color => {
        colors.push({name: color, car});
      });
      await this.colorRepository.save(colors);
    }

    return new SuccessResponseDto(
      'Car has been added successfully',
      null,
      201
    );
  }

  async findAll(query: any) {
    const response = await this.getCars(query);
    return response;
  }

  async findOne(id: number) {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: {
        attachments: true,
        rates: {
          user: true
        },
        colors: true,
        user: true
      },
      select: {
        rates: {
          id: true,
          rate: true,
          comment: true,
          user: {
            id: true,
            nickName: true,
            fullName: true,
            email: true,
            picture: true
          }
        },
        user: {
          id: true,
          nickName: true,
          fullName: true,
          email: true,
          picture: true
        }
      }
    });

    const ratesCount = await this.rateRepository.count({where: {car: { id }}});
    const ratesSum = await this.rateRepository.sum('rate', {car: {id}});
    

    return new SuccessResponseDto(
      '',
      { car, carRate: ratesCount ? (ratesSum / ratesCount) : 0 },
      200
    );
  }

  async update(id: number, updateCarDto: UpdateCarDto, files: Express.Multer.File[], user: User) {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: {
        user: true,
        attachments: true
      }
    });

    if(!car){
      throw new BadRequestException(new FailResponseDto(
        ['There is no car with this id'],
        'Validation error!',
        400
      ));
    }

    if(user.id !== car.user.id){
      throw new UnauthorizedException(new FailResponseDto(
        ['You can not edit or delete this car!'],
        'Unauthorized',
        401
      ));
    }

    if(updateCarDto.brandId){
      const brand = await this.brandRepository.findOneBy({id: updateCarDto.brandId});

      if(!brand){
        throw new BadRequestException(new FailResponseDto(
          ['There is no brand with this id'],
          'Validation error!',
          400
        ));
      }

      updateCarDto.brand = brand;
    }

    if(files){
      await this.attachmentRepository.remove(car.attachments);

      let attachments: Attachment[] = [];
      let prefixPath= this.configService.get<string>('prefixPath');
      files.forEach(file => {
        attachments.push(this.attachmentRepository.create({
          url: `${prefixPath}/uploads/cars/${file.filename}`,
          type: file.mimetype.startsWith('video') ? 'video' : 'image',
          car
        }));
      });

      await this.attachmentRepository.save(attachments);
    }

    if(updateCarDto.carColors.length > 0){
      if(car.colors && car.colors.length > 0){
        await this.colorRepository.remove(car.colors);
      }
      let colors = [];
      updateCarDto.carColors.forEach(color => {
        colors.push({name: color, car});
      });
      await this.colorRepository.save(colors);
    }

    delete updateCarDto.brandId;
    delete updateCarDto.carColors;
    await this.carRepository.update({id}, { ...updateCarDto });

    return new SuccessResponseDto(
      'Car has been updated successfully',
      null,
      200
    );
  }

  async remove(id: number, user: User) {
    const car = await this.carRepository.findOne({
      where: {id},
      relations: {
        user: true
      }
    });

    if(!car){
      throw new NotFoundException(new FailResponseDto(
        ['There is no cars with this id'],
        'Validation error',
        404
      ));
    }

    if(user.id !== car.user.id){
      throw new UnauthorizedException(new FailResponseDto(
        ['You can not edit or delete this car!'],
        'Unauthorized',
        401
      ));
    }

    await this.carRepository.remove(car);

    return new SuccessResponseDto(
      'car has been removed successfully',
      null,
      200
    );
  }

  async findMyCars(query: any, user: User) {
    const response = await this.getCars({...query, userId: user.id});
    return response;
  }

  async getBestOffers(query: any) {
    const response = await this.getCars({...query, orderby: 'price'});
    return response;
  }

  private async getCars(query: any) {
    let { page, perPage, name, price, userId, orderby } = query;

    const order: FindOptionsOrderProperty<Car> = (orderby === 'price')
      ? { price: 'ASC' }
      : { id: 'DESC' };
    
    let filter: FindOptionsWhere<Car>[] = [];
    let baseFilter: FindOptionsWhere<Car> = {};
    
    baseFilter.available = true;
    if(userId){
      baseFilter.user = {id: userId};
    }
    if(price){
      baseFilter.price = LessThanOrEqual(price);
    }
    if(name){
      filter.push({...baseFilter, name: Like(`%${name}%`)});
      filter.push({...baseFilter, description: Like(`%${name}%`)});
      filter.push({...baseFilter, type: Like(`%${name}%`)});
      filter.push({...baseFilter, brand: {name: Like(`%${name}%`)}});
    }
    else{
      filter.push({...baseFilter});
    }

    const pagnationQuery = {
      where: filter,
      relations: ['brand', 'attachments', 'user'],
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
        user: {
          id: true
        }
      },
      order
    };

    const options = {
      page,
      perPage
    };

    const response = await pagnationService(Car, pagnationQuery, options);
    return response;
  }
}
