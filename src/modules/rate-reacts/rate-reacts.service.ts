import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRateReactDto } from './dto/create-rate-react.dto';
import { User } from 'src/database/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from 'src/database/entities/Rate.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RateReact } from 'src/database/entities/RateReact.entity';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';
@Injectable()
export class RateReactsService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
    @InjectRepository(RateReact)
    private readonly reactRepository: Repository<RateReact>
  ){}

  async create(createRateReactDto: CreateRateReactDto, user: User) {
    const rate = await this.rateRepository.findOneBy({id: createRateReactDto.rateId});
    if(!rate){
      throw new NotFoundException(new FailResponseDto(
        ['There is no rate with this id'],
        'Validation error!',
        404
      ));
    }

    const oldReact = await this.reactRepository.findOne({
      where: {
        user: { id: user.id },
        rate: { id: rate.id }
      }
    });

    if(oldReact){
      await this.reactRepository.remove(oldReact);
    }

    await this.reactRepository.save({
      rate: rate,
      user: user,
      react: createRateReactDto.react
    });

    return new SuccessResponseDto(
      'React has been added successfully',
      null,
      201
    );
  }

  async findAll(query: any) {
    const { page, perPage, rateId } = query;

    let filter: FindOptionsWhere<RateReact> = {};
    if(rateId){
      filter.rate = { id: rateId };
    }

    const pagnationQuery = {
      where: filter,
      relations: { user: true },
      select: {
        id: true,
        react: true,
        user: {
          id: true,
          fullName: true,
          nickName: true,
          picture: true,
        }
      }
    };

    const options = {
      page,
      perPage
    }

    const respone = await pagnationService(RateReact, query, options);

    return respone;
  }

  async remove(id: number, user: User) {
    const react = await this.reactRepository.findOne({
      where: { id: id },
      relations: { user: true }
    });

    if(!react){
      throw new NotFoundException(new FailResponseDto(
        ['There is no react with this id'],
        'Validation error!',
        404
      ));
    }

    if(react.user.id != user.id){
      throw new UnauthorizedException(new FailResponseDto(
        ['You can not remove that react'],
        'Unauthorized',
        401
      ));
    }

    await this.reactRepository.remove(react);

    return new SuccessResponseDto(
      'React has been removed successfully',
      null,
      200
    );
  }

  async removeByRate(rateId: number, user: User) {
    const react = await this.reactRepository.findOne({
      where: { 
        rate: { id: rateId },
        user: { id: user.id }
      },
      relations: { user: true }
    });

    if(!react){
      throw new NotFoundException(new FailResponseDto(
        ['There is no rate with this id'],
        'Validation error!',
        404
      ));
    }

    await this.reactRepository.remove(react);

    return new SuccessResponseDto(
      'React has been removed successfully',
      null,
      200
    );
  }
}
