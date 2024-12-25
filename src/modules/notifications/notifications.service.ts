import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { pagnationService } from 'src/common/services/pagnationService';
import { Notification } from 'src/database/entities/Notification.entity';
import { User } from 'src/database/entities/User.entity';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ){}

  async findAll(query: any, user: User) {
    let { page, perPage, word } = query;

    let order: FindOptionsOrder<Notification> = {id: 'DESC'};
    let filter: FindOptionsWhere<Notification> = {};
    filter.user = { id: user.id };
    if(word){
      filter.body = Like(`%${word}%`);
    }

    const pagnationQuery = {
      where: filter,
      order
    };

    const options = {
      page,
      perPage
    };

    const response = await pagnationService(Notification, pagnationQuery, options);
    return response;
  }

  async update(user: User) {
    await this.notificationRepository.update({user: {id: user.id}}, {
      isSeen: true
    });

    return new SuccessResponseDto(
      'Notifications seen status have been changed successfully',
      null,
      200
    );
  }

  async getUnseenCount(user: User){
    const notificationsCount = await this.notificationRepository.count({
      where: {user: {id: user.id}}
    });

    return new SuccessResponseDto(
      '',
      {notificationsCount},
      200
    );
  }
}
