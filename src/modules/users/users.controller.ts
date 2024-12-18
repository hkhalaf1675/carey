import { Controller, Get, Post, Body, Patch, UseGuards, Request, Query, HttpCode, Delete, ParseIntPipe, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdatePinDto } from './dto/update-pin.dto';
import { PasswodrDto } from './dto/password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my-profile')
  async findOne(@Request() req: any) {
    return await this.usersService.findOne(req.user.id);
  }

  @Patch('update-my-profile')
  async update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('update-my-email')
  async updateEmail(@Request() req: any,@Body() updateEmailDto: UpdateEmailDto) {
    return await this.usersService.updateEmail(req.user.id, updateEmailDto.email);
  }

  @Post('update-my-phone')
  async updatePhone(@Request() req: any,@Body() updatePhoneDto: UpdatePhoneDto) {
    return await this.usersService.updatePhone(req.user.id, updatePhoneDto.phone);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query() query: any){
    return await this.usersService.verifyEmail(query?.token);
  }

  @Post('verify-my-phone')
  async verifyPhone(@Request() req: any, @Body() updatePinDto: UpdatePinDto){
    return await this.usersService.verifyPhone(req.user.id, updatePinDto.pin);
  }

  @Get('get-verify-pin')
  async sendVerifyPin(@Request() req: any){
    return await this.usersService.sendVerificationPin(req.user.id);
  }

  @Get('get-verify-email')
  async sendVerifyEmail(@Request() req: any){
    return await this.usersService.sendVerificationEmail(req.user.id);
  }

  @HttpCode(200)
  @Post('update-pin')
  async createPinCode(@Request() req: any, @Body() updatePinDto: UpdatePinDto){
    return await this.usersService.createPinCode(req.user.id, updatePinDto.pin);
  }

  @HttpCode(200)
  @Post('login-with-pin')
  async loginWithPin(@Request() req: any, @Body() updatePinDto: UpdatePinDto){
    return await this.usersService.loginWithPin(req.user.id, updatePinDto.pin);
  }

  @Delete('delete-my-account')
  async deleteAccount(@Request() req: any, @Body() passwordDto: PasswodrDto){
    return await this.usersService.deleteAccount(req.user.id, passwordDto.password);
  }

  @Public()
  @Get('get-account')
  async getAccount(@Body() updateEmailDto: UpdateEmailDto){
    return await this.usersService.getAccount(updateEmailDto.email);
  }

  @Public()
  @Post('send-sms-pin')
  async sendSmsPin(@Body('userId', ParseIntPipe) userId: number){
    return await this.usersService.sendSmsPin(userId);
  }

  @Public()
  @Post('send-mail-pin')
  async sendMailPin(@Body('userId', ParseIntPipe) userId: number){
    return await this.usersService.sendMailPin(userId);
  }

  @Public()
  @Post(':userId/account-recovery')
  async accountRecovery(@Param('userId', ParseIntPipe) userId: number, @Body() updatePinDto: UpdatePinDto){
    return await this.usersService.accountRecovery(userId, updatePinDto.pin);
  }

  @HttpCode(200)
  @Post('create-biometric')
  async createBiometric(@Request() req: any, @Body() passwordDto: PasswodrDto){
    return await this.usersService.createBiometric(req.user.id, passwordDto.password);
  }
  
  @HttpCode(200)
  @Post('remove-biometric')
  async removeBiometric(@Request() req: any, @Body() passwordDto: PasswodrDto){
    return await this.usersService.removeBiometric(req.user.id, passwordDto.password);
  }

  @HttpCode(200)
  @Post('update-password')
  async updatePassword(@Request() req: any, @Body() passwordDto: PasswodrDto){
    return await this.usersService.updatePassword(req.user.id, passwordDto.password);
  }

  @Post('update-picture')
  @UseInterceptors(FileInterceptor('picture'))
  async updatePicture(@Request() req: any, @UploadedFile() picture: Express.Multer.File){
    return await this.usersService.updatePicture(req.user.id, picture);
  }
}
