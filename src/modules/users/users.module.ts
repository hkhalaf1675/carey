import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { MailService } from 'src/common/services/mail.service';
import { NotificationService } from 'src/common/services/notification.service';
import { PhoneVerificationPin } from 'src/database/entities/PhoneVerificationPin';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PhoneVerificationPin])
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService, NotificationService],
  exports: []
})
export class UsersModule {}
