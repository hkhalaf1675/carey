import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/Role.entity';
import { Like, Repository } from 'typeorm';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ){}

  async create(createRoleDto: CreateRoleDto) {
    const oldRole = await this.roleRepository.findOneBy({name: createRoleDto.name});
    if(oldRole && oldRole !== undefined && oldRole !== null){
      throw new BadRequestException(new FailResponseDto(
        ['There is role with this name exists'],
        'Validation error!',
        400
      ));
    }

    const role = await this.roleRepository.save({...createRoleDto});

    return new SuccessResponseDto(
      'Role has been created successfully',
      null,
      201
    );
  }

  async findAll(query: any) {
    let { page, perPage, name } = query;

    let filter: {[key: string]: any;} = {};
    if(name){
      filter['name'] = Like(`%${name}%`);
    }

    const pagnationQuery = {
      where: filter,
      select: {
        id: true,
        name: true,
        description: true
      }
    }

    const options = {
      page,
      perPage
    }

    const response = await pagnationService(Role, pagnationQuery, options);
    return response;
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: {id},
      select: {
        name: true,
        description: true,
        id: true
      }
    });

    return new SuccessResponseDto(
      '',
      { role },
      200
    );
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    let role = await this.roleRepository.findOneBy({id});

    if(!role || role === undefined || role === null){
      throw new NotFoundException(new FailResponseDto(
        ['There is no role with this id'],
        'Valation error!',
        404
      ));
    }

    await this.roleRepository.update({id}, {...updateRoleDto});

    return new SuccessResponseDto(
      'Role has been updated successfully',
      null,
      200
    );
  }

  async remove(id: number) {
    let role = await this.roleRepository.findOneBy({id});

    if(!role || role === undefined || role === null){
      throw new NotFoundException(new FailResponseDto(
        ['There is no role with this id'],
        'Valation error!',
        404
      ));
    }

    await this.roleRepository.delete({id});

    return new SuccessResponseDto(
      'Role has been deleted successfully',
      null,
      200
    );
  }
}
