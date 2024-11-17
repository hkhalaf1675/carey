import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { MailService } from 'src/common/services/mail.service';
import { NotificationService } from 'src/common/services/notification.service';
import { PinCode } from 'src/database/entities/PinCode.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PinCode]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`)
        }
      })
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService, NotificationService],
  exports: []
})
export class UsersModule {}
