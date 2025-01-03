import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.create(createOfferDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.offersService.findAll(query);
  }

  @Get('my-offers')
  async findMyOffers(@Query() query: any, @Request() req: any) {
    return await this.offersService.findMyOffers(query, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return await this.offersService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.offersService.remove(+id);
  }
}
