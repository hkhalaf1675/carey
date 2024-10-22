import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { Repository } from 'typeorm';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { Role } from 'src/database/entities/Role.entity'
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/common/services/mail.service';
;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  )
  {}

  async register(registerDto: LoginDto) {
    // ensure that there is exists role with this id
    // const existsRole = await this.roleRepository.findOneBy({id: registerDto.roleId});
    // if(!existsRole || existsRole === undefined || existsRole === null){
    //   throw new BadRequestException(new FailResponseDto(
    //     ['There is no role exists with the same id'],
    //     'Validation error',
    //     400
    //   ));
    // }

    // check that there is no users with this email
    let oldUsersWithSameEmail = await this.userRepository.findOneBy({email: registerDto.email});
    if(
      oldUsersWithSameEmail &&
      oldUsersWithSameEmail !== undefined &&
      oldUsersWithSameEmail !== null
    ){
      throw new BadRequestException(new FailResponseDto(
        ['There is already user exists with the same email'],
        'Validation error',
        400
      ));
    }

    // hashing the password
    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, slat);

    // create the new user
    let newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword
    });

    newUser = await this.userRepository.save(newUser)
    /* 
      userRepository.create(): is create new local object but nt store it into the database
    */

    // create jwt token
    const payload = {
      user: {id: newUser.id, email: newUser.email}
    };

    const token = await this.jwtService.signAsync(payload);

    // send mail to verify user email
    try {
      this.mailService.sendMail(newUser.email, token);
    } catch (error) {
      console.log('Error at sending email at register:');
      console.log(error);
      return new SuccessResponseDto(
        'You have been registered successfully, Please, Check your email to verify your account.',
        {newUser, token},
        200
      );
    }

    return new SuccessResponseDto(
      'You have been registered successfully, Please, Check your email to verify your account.',
      {newUser, token},
      200
    );
  }

  async login(loginDto: LoginDto) {
    const existsUser = await this.userRepository.findOne({
      where: {email: loginDto.email},
      select: {
        id: true,
        email: true,
        password: true,
        role: {
          id: true,
          name: true
        }
      },
      relations: { role: true }
    });

    if(!existsUser || existsUser === undefined || existsUser === null){
      throw new UnauthorizedException(new FailResponseDto(
        ['There was a problem logging in. Check your email and password or create an account.'],
        'Validation error',
        401
      ));
    }
    const {password, ...user} = existsUser;
    const isMatch = await bcrypt.compare(loginDto.password, password);

    if(!isMatch){
      throw new UnauthorizedException(new FailResponseDto(
        ['There was a problem logging in. Check your email and password or create an account.'],
        'Validation error',
        401
      ));
    }

    const payload = {
      user: { id: user.id, email: user.email},
      role: user.role.name
    }

    const token = await this.jwtService.signAsync(payload);

    return new SuccessResponseDto(
      'login successfully',
      { user, token },
      200
    );
  }

  async externalLogin(user: any) {
    if(!user || user === undefined || user === null){
      throw new UnauthorizedException(new FailResponseDto(
        ['No user from google'],
        'Validation error!',
        401
      ));
    }

    let existsUser = await this.userRepository.findOneBy({LoginAppId: user.LoginAppId});
    if(!existsUser || existsUser === undefined || existsUser === null){
      existsUser = await this.userRepository.save({...user});
    }

    const payload = {
      user: { id: existsUser.id, email: existsUser.email },
      role: 'none'
    };

    const token = await this.jwtService.signAsync(payload);

    return new SuccessResponseDto(
      'You have been registered successfully',
      { user: existsUser, token },
      200
    );
  }
}

