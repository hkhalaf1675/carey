import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/Brand.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';

@Injectable()
export class BrandService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>
  ){}

  async create(createBrandDto: CreateBrandDto, image: Express.Multer.File) {
    if(!image){
      throw new BadRequestException(new FailResponseDto(
        ['Please uplaod image '],
        'Validation error!',
        400
      ));
    }

    const imageUrl = `${this.configService.get<string>('prefixPath')}/uploads/brands/${image.filename}`;

    await this.brandRepository.save({
      ...createBrandDto,
      image: imageUrl
    });

    return new SuccessResponseDto(
      'brand has been added successfully',
      null,
      201
    );
  }

  async findAll(query: any) {
    const { name, page, perPage } = query;
    let filter: FindOptionsWhere<Brand> = {};
    if(name){
      filter.name = Like(`%${name}%`);
    }

    const pagnationQuery = {
      where: filter,
      select: ['id', 'name', 'image']
    };

    const options = {
      page,
      perPage
    };

    const response = await pagnationService(Brand, pagnationQuery, options);
    return response;
  }

  async remove(id: number) {
    const brand = await this.brandRepository.findOneBy({id});

    if(!brand){
      throw new NotFoundException(new FailResponseDto(
        ['There is no brands with this id'],
        'Validation error',
        404
      ));
    }

    await this.brandRepository.remove(brand);

    return new SuccessResponseDto(
      'Brand has been removed successfully',
      null,
      200
    );
  }
}
