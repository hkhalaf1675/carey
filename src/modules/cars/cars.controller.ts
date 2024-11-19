import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Request, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseInterceptors(FilesInterceptor('attachments'))
  @Post()
  async create(@Body() createCarDto: CreateCarDto, @UploadedFiles() files: Express.Multer.File[], @Request() req: any) {
    return await this.carsService.create(createCarDto, files, req.user);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.carsService.findAll(query);
  }

  @Get('best-offers')
  async getBestOffers(@Query() query: any) {
    return await this.carsService.getBestOffers(query);
  }

  @Get('my-cars')
  async findMyCars(@Query() query: any, @Request() req: any) {
    return await this.carsService.findMyCars(query, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carsService.findOne(+id);
  }
  
  @UseInterceptors(FilesInterceptor('attachments'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto, @UploadedFiles() files: Express.Multer.File[], @Request() req: any) {
    return await this.carsService.update(+id, updateCarDto, files, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.carsService.remove(+id, req.user);
  }
}
