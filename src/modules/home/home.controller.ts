import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { HomeService } from './home.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}


  @Get()
  async findAll(@Request() req: any) {
    return await this.homeService.findAll(req.user);
  }
}
