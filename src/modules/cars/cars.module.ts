import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/database/entities/Car.entity';
import { Brand } from 'src/database/entities/Brand.entity';
import { Attachment } from 'src/database/entities/Attachment.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, Brand, Attachment]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/cars',
        filename(req, file, callback) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${file.mimetype.split('/')[0]}-${uniqueSuffix}${extname(file.originalname)}`)
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter(req, file, callback) {
          if(file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi|wmv|mkv)$/)){
            callback(null, true);
          }
          else{
            callback(new HttpException(new FailResponseDto(
              ['Unsupported file type!'],
              'Validation Error',
              400
            ), HttpStatus.BAD_REQUEST), false);
          }
      },
    })
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
