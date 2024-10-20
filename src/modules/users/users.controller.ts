import { Controller, Get, Post, Body, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Public } from 'src/common/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my-profile')
  findOne(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('update-my-profile')
  update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('update-my-email')
  updateEmail(@Request() req: any,@Body() updateEmailDto: UpdateEmailDto) {
    return this.usersService.updateEmail(req.user.id, updateEmailDto.email);
  }

  @Post('update-my-phone')
  updatePhone(@Request() req: any,@Body() updatePhoneDto: UpdatePhoneDto) {
    return this.usersService.updatePhone(req.user.id, updatePhoneDto.phone);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query() query: any){
    return await this.usersService.verifyEmail(query?.token);
  }

  @Post('verify-my-phone')
  async verifyPhone(@Request() req: any, @Body('pin') pin: string){
    return await this.usersService.verifyPhone(req.user.id, pin);
  }

  @Get('get-verify-pin')
  async sendVerifyPin(@Request() req: any){
    return await this.usersService.sendVerificationPin(req.user.id);
  }

  @Get('get-verify-email')
  async sendVerifyEmail(@Request() req: any){
    return await this.usersService.sendVerificationEmail(req.user.id);
  }
}
