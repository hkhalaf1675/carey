import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/Brand.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/brands',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.mimetype.split('/')[0]}${extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter: (req, file, cb) => {
        if(file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)){
          cb(null, true);
        }
        else{
          cb(new HttpException(new FailResponseDto(
            ['Unsupported file type!'],
            'Validation Error!',
            400
          ), HttpStatus.BAD_REQUEST), false);
        }
      }
    })
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
