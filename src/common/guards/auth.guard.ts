import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import dataSource from 'src/database/data-source';
import { User } from 'src/database/entities/User.entity';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ){}

  async canActivate(
    context: ExecutionContext,
  ) {
    
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if(isPublic){
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.exractTokenFromHeader(request);

    if(!token || token === undefined){
      throw new UnauthorizedException(new FailResponseDto(
        ['Token is required'],
        'Unauthorized',
        401
      ));
    }

    try {
      const {user} = await this.jwtService.verifyAsync(
        token, {
          secret: this.configService.get<string>('jwt.secret')
        }
      );

      if(user && user !== undefined && user !== null){
        const myDataSource = await dataSource.initialize();
        const foundUser = await myDataSource.manager.findOneBy(User, {id: user.id});

        if(!foundUser || foundUser === undefined || foundUser === null){
          return false;
        }
        request['user'] = foundUser;

        await myDataSource.destroy();

        return true;
      }
      else{
        return false;
      }
      
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(new FailResponseDto(
        ['Token was expired'],
        'Unauthorized',
        401
      ));
    }
  }

  private exractTokenFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
