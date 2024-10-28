import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { Repository } from 'typeorm';
import { SuccessResponseDto } from 'src/common/dto/success.response.dto';
import { FailResponseDto } from 'src/common/dto/fail.response.dto';
import { MailService } from 'src/common/services/mail.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from 'src/common/services/notification.service';
import { PinCode } from 'src/database/entities/PinCode';
import * as bcrypt from "bcrypt";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    @InjectRepository(PinCode)
    private readonly pinRepository: Repository<PinCode>,
  ){}

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {id},
      select: {
        id: true,
        fullName: true,
        nickName: true,
        email: true,
        phone: true,
        picture: true,
        gender: true,
        address: true
      },
      relations: {
        role: true
      }
    });

    return new SuccessResponseDto(
      '',
      { user },
      200
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on update my profile: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    if(updateUserDto.phone){
      const oldUserWithSamePhone = await this.userRepository.findOneBy({phone: updateUserDto.phone});

      if(oldUserWithSamePhone && user.id !== oldUserWithSamePhone.id){
        throw new BadRequestException(new FailResponseDto(
          ['This phone number is already used!'],
          'Validation error',
          400
        ));
      }
    }

    await this.userRepository.update({id}, {...updateUserDto});

    return new SuccessResponseDto(
      'profile has been updated successfully',
      null,
      200
    );
  }

  async updateEmail(id: number, email: string){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on update email: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    const oldUserWithSameEmail = await this.userRepository.findOneBy({email});
    if(oldUserWithSameEmail && oldUserWithSameEmail.id !== user.id){
      throw new BadRequestException(new FailResponseDto(
        ['This email addess is already used'],
        'Validation error',
        400
      ));
    }

    if(user.email === email){
      throw new BadRequestException(new FailResponseDto(
        ['This email addess is the same that exists'],
        'Validation error',
        400
      ));
    }

    user.email = email;
    await this.userRepository.save(user);

    const payload = {
      user: {id: user.id, email},
      role: 'none'
    }

    const token = await this.jwtService.signAsync(payload);

    const verificationLink = `${this.configService.get<string>('VERIFICATION_BASE_URL')}?token=${token}`;
    const message = `<p>please click on this link: </p><br>
                    <a href="${verificationLink}">${verificationLink}</a><br>
                    <p>to verify your email address. </p><br>`;
    const subject = 'Carey: Verify Your Email';

    // send mail to verify user email
    try {
      this.mailService.sendMail(user.email, subject, message);
    } catch (error) {
      console.log('Error at sending mail at update mail: ');
      console.log(error);
      
      return new SuccessResponseDto(
        'Email has been updated successfully, Check your email to verify your account.',
        null,
        200
      );
    }

    return new SuccessResponseDto(
      'Email has been updated successfully, Check your email to verify your account.',
      null,
      200
    );
  }

  async updatePhone(id: number, phone: string){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on update my profile: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    const oldUserWithSamePhone = await this.userRepository.findOneBy({phone});
    if(oldUserWithSamePhone && oldUserWithSamePhone.id !== user.id){
      throw new BadRequestException(new FailResponseDto(
        ['This phone is already used'],
        'Validation error',
        400
      ));
    }

    if(user.phone === phone){
      throw new BadRequestException(new FailResponseDto(
        ['This phone is the same that exists'],
        'Validation error',
        400
      ));
    }

    user.phone = phone;
    await this.userRepository.save(user);

    const pin = this.generatePin();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // hashing the pin
    const slat = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(`${pin}`, slat);
    
    await this.pinRepository.save({
      pin: hashedPin,
      userId: user.id,
      expiresAt
    });

    try {
      await this.notificationService.sendSms(phone, `Carey Verification code: ${pin}`);
    } catch (error) {
      console.log('Error at send sms at update phone: ');
      console.log(error);
      
      return new SuccessResponseDto(
        'Phone has been updated successfully, Check your Sms to verify your phone number.',
        null,
        200
      );
    }

    return new SuccessResponseDto(
      'Phone has been updated successfully, Check your Sms to verify your phone number.',
      null,
      200
    );
  }

  async verifyEmail(token: string){
    // ensure that the token was send
    if(!token || token === undefined || token === null){
      throw new BadRequestException('That link was expired!');
    }

    // decode the token and get the user
    try {
      const payload = await this.jwtService.verifyAsync(
        token, {
        secret: this.configService.get<string>('jwt.secret')
      });

      const user = await this.userRepository.findOneBy({id: payload.user?.id});
      user.emailVerified = true;
      await this.userRepository.save(user);

      return { message: 'Email was verified successfully'}
    } catch (error) {
      console.log('Error at decode token: ');
      console.log(error);

      throw new BadRequestException('That link was expired!')
    }
  }

  async verifyPhone(id: number, pin: string){
    if(!pin){
      throw new BadRequestException(new FailResponseDto(
        ['Pin should be not empty'],
        'Validation error',
        400
      ));
    }

    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on update my profile: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    const pinCode = await this.pinRepository.findOne({
      where: { userId: user.id },
      order: {
        createdAt: 'DESC'
      }
    });

    if(!pinCode){
      throw new BadRequestException(new FailResponseDto(
        ['Pin was invalid or expired'],
        'Validation error',
        400
      ));
    }

    const isMatch = bcrypt.compareSync(pin, pinCode.pin);
    const currentTime = new Date();
    if(!isMatch || pinCode.expiresAt < currentTime){
      throw new BadRequestException(new FailResponseDto(
        ['Pin was invalid or expired'],
        'Validation error',
        400
      ));
    }

    user.phoneVerified = true;
    await this.userRepository.save(user);

    await this.pinRepository.delete(pinCode.id);

    return new SuccessResponseDto(
      'Your Phone has been verified successfully',
      null,
      200
    );
  }

  async sendVerificationPin(id: number){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on send verification pin: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    if(!user.phone){
      throw new BadRequestException(new FailResponseDto(
        ['Please eneter your phone number first!'],
        'Validation error',
        400
      ));
    }

    await this.sendSms(user.id, user.phone);

    return new SuccessResponseDto(
      'Check your Sms to verify your phone number.',
      null,
      200
    );
  }

  async sendVerificationEmail(id: number){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on send verification mail: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    if(!user.email){
      throw new BadRequestException(new FailResponseDto(
        ['Please eneter your email address first!'],
        'Validation error',
        400
      ));
    }

    if(user.emailVerified === true){
      throw new BadRequestException(new FailResponseDto(
        ['Your email address is already verified'],
        'Validation error',
        400
      ));
    }

    // create jwt token
    const payload = {
      user: {id: user.id, email: user.email},
      role: 'none'
    };

    const token = await this.jwtService.signAsync(payload);

    const verificationLink = `${this.configService.get<string>('VERIFICATION_BASE_URL')}?token=${token}`;
    const message = `<p>please click on this link: </p><br>
                    <a href="${verificationLink}">${verificationLink}</a><br>
                    <p>to verify your email address. </p><br>`;
    const subject = 'Carey: Verify Your Email';

    // send mail to verify user email
    try {
      this.mailService.sendMail(user.email, subject, message);
    } catch (error) {
      console.log('Error at send verify email: ');
      console.log(error);
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Something went wrong!',
        500
      ));
    }

    return new SuccessResponseDto(
      'Check your email to verify your account.',
      null,
      200
    );
  }

  async createPinCode(id: number, pin: string){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on creatge pin: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPin = bcrypt.hashSync(pin, salt);

    user.pinCode = hashedPin;
    await this.userRepository.save(user);

    return new SuccessResponseDto(
      'Pin has been updated successfully.',
      null,
      200
    );
  }

  async loginWithPin(id: number, pin: string){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on login with pin: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    if(!user.pinCode){
      throw new BadRequestException(new FailResponseDto(
        ['There is no pin saved!'],
        'Bad Request',
        400
      ));
    }

    const isMatch = bcrypt.compareSync(pin, user.pinCode);
    if(!isMatch){
      throw new UnauthorizedException(new FailResponseDto(
        ['Wrong Pin'],
        'Validation error',
        401
      ));
    }

    return new SuccessResponseDto(
      'Success',
      null,
      200
    );
  }

  async deleteAccount(id: number, password: string){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('on delete account: no user was found for that token');
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Bad Request',
        400
      ));
    }

    const passwordMatching = bcrypt.compareSync(password, user.password);
    if(!passwordMatching){
      throw new UnauthorizedException(new FailResponseDto(
        ['Password is not correct!'],
        'Unauthorized user',
        401
      ));
    }

    await this.userRepository.delete(id);

    return new SuccessResponseDto(
      'Account has been deleted successfully',
      null,
      200
    );
  }

  async getAccount(email: string){
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        phone: true
      }
    });

    if(!user || user === undefined || user === null){
      throw new NotFoundException(new FailResponseDto(
        ['There is no account with this email address!'],
        'Not Found',
        404
      ));
    }

    return new SuccessResponseDto(
      '',
      { user },
      200
    );
  }

  async sendSmsPin(id: number){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('Error at sms pin: account with that id found');
      
      throw new InternalServerErrorException(new FailResponseDto(
        ['Some went wrong!'],
        'Somewent wrong',
        500
      ));
    }

    if(!user.phone){
      throw new BadRequestException(new FailResponseDto(
        ['Please eneter your phone number first!'],
        'Validation error',
        400
      ));
    }

    await this.sendSms(user.id, user.phone);

    return new SuccessResponseDto(
      'Check your Sms.',
      null,
      200
    );
  }

  async sendMailPin(id: number){
    const user = await this.userRepository.findOneBy({id});
    if(!user || user === undefined || user === null){
      console.log('Error at sms pin: account with that id found');
      
      throw new InternalServerErrorException(new FailResponseDto(
        ['Some went wrong!'],
        'Somewent wrong',
        500
      ));
    }

    if(!user.email){
      throw new BadRequestException(new FailResponseDto(
        ['Please eneter your email first!'],
        'Validation error',
        400
      ));
    }

    const pin = this.generatePin();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // hashing the pin
    const slat = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(`${pin}`, slat);
    
    await this.pinRepository.save({
      pin: hashedPin,
      userId: user.id,
      expiresAt
    });

    const message = `<p>We received a request to reset your Facebook password.<p><br />
                      <p>Enter the following password reset code:<p><br />
                      <span style="border: 1px solid gray; padding:3px;">${pin}</span><br />`;

    const subject = 'Carey account recovery code'

    // send mail to verify user email
    try {
      this.mailService.sendMail(user.email, subject, message);
    } catch (error) {
      console.log('Error at send verify email: ');
      console.log(error);
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Something went wrong!',
        500
      ));
    }

    return new SuccessResponseDto(
      'Check your mail.',
      null,
      200
    );
  }

  async accountRecovery(id: number, pin: string){
    const user = await this.userRepository.findOne({
      where: {id},
      select: {
        id: true,
        email: true
      }
    });
    if(!user || user === undefined || user === null){
      console.log('Error at account recovery: account with that id is not found');
      
      throw new InternalServerErrorException(new FailResponseDto(
        ['Some went wrong!'],
        'Somewent wrong',
        500
      ));
    }

    const pinCode = await this.pinRepository.findOne({
      where: { userId: user.id },
      order: {
        createdAt: 'DESC'
      }
    });

    if(!pinCode){
      throw new BadRequestException(new FailResponseDto(
        ['Pin was invalid or expired'],
        'Validation error',
        400
      ));
    }

    const isMatch = bcrypt.compareSync(pin, pinCode.pin);
    const currentTime = new Date();
    if(!isMatch || pinCode.expiresAt < currentTime){
      throw new BadRequestException(new FailResponseDto(
        ['Pin was invalid or expired'],
        'Validation error',
        400
      ));
    }

    const payload = {
      user: { id: user.id, email: user.email }
    }

    const token = await this.jwtService.signAsync(payload);

    await this.pinRepository.delete(pinCode.id);

    return new SuccessResponseDto(
      'login successfully',
      { user, token },
      200
    );
  }

  async createBiometric(id: number, password: string){
    const user = await this.userRepository.findOne({
      where: {id}
    });
    if(!user || user === undefined || user === null){
      console.log('Error at account recovery: account with that id is not found');
      
      throw new InternalServerErrorException(new FailResponseDto(
        ['Some went wrong!'],
        'Somewent wrong',
        500
      ));
    }

    const passwordMatching = bcrypt.compareSync(password, user.password);
    if(!passwordMatching){
      throw new UnauthorizedException(new FailResponseDto(
        ['wrong passowrd!'],
        'Unauthorized ',
        401
      ));
    }

    user.biometricVerified = true;
    this.userRepository.save(user);

    return new SuccessResponseDto(
      'user biometric created successfully',
      null,
      200
    );
  }

  async removeBiometric(id: number, password: string){
    const user = await this.userRepository.findOne({
      where: {id}
    });
    if(!user || user === undefined || user === null){
      console.log('Error at account recovery: account with that id is not found');
      
      throw new InternalServerErrorException(new FailResponseDto(
        ['Some went wrong!'],
        'Somewent wrong',
        500
      ));
    }

    const passwordMatching = bcrypt.compareSync(password, user.password);
    if(!passwordMatching){
      throw new UnauthorizedException(new FailResponseDto(
        ['wrong passowrd!'],
        'Unauthorized ',
        401
      ));
    }

    user.biometricVerified = false;
    this.userRepository.save(user);

    return new SuccessResponseDto(
      'user biometric removed successfully',
      null,
      200
    );
  }
  
  async updatePassword(id: number, password: string){
    const user = await this.userRepository.findOne({
      where: {id}
    });
    if(!user || user === undefined || user === null){
      console.log('Error at account recovery: account with that id is not found');
      
      throw new InternalServerErrorException(new FailResponseDto(
        ['Some went wrong!'],
        'Somewent wrong',
        500
      ));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    this.userRepository.save(user);

    return new SuccessResponseDto(
      'user password updated successfully',
      null,
      200
    );
  }

  private generatePin(): number{
    return Math.floor(100000 + Math.random() * 900000);
  }

  async sendSms(userId: number, phone: string){
    const pin = this.generatePin();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // hashing the pin
    const slat = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(`${pin}`, slat);
    
    await this.pinRepository.save({
      pin: hashedPin,
      userId,
      expiresAt
    });

    try {
      await this.notificationService.sendSms(phone, `Carey code: ${pin}`);
    } catch (error) {
      console.log('Error at send sms: ');
      console.log(error);
      
      throw new BadRequestException(new FailResponseDto(
        ['Something went wrong!'],
        'Something went wrong!',
        500
      ));
    }
  }
}
