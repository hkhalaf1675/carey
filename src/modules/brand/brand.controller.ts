import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createBrandDto: CreateBrandDto, @UploadedFile() file: Express.Multer.File) {
    return await this.brandService.create(createBrandDto, file);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.brandService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.brandService.remove(+id);
  }
}
