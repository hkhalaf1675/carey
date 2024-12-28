import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { BrandModule } from './modules/brand/brand.module';
import { CarsModule } from './modules/cars/cars.module';
import { RatesModule } from './modules/rates/rates.module';
import { HomeModule } from './modules/home/home.module';
import { OffersModule } from './modules/offers/offers.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RateReactsModule } from './modules/rate-reacts/rate-reacts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('nodemailer.host'),
            auth: {
              user: configService.get<string>('nodemailer.user'),
              pass: configService.get<string>('nodemailer.pass'),
            }
          }
        }
      }
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') }
        }
      },
      global: true
    }),
    AuthModule,
    RolesModule,
    UsersModule,
    BrandModule,
    CarsModule,
    RatesModule,
    HomeModule,
    OffersModule,
    WishlistModule,
    NotificationsModule,
    RateReactsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
