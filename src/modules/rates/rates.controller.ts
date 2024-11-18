import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { RatesService } from './rates.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Post()
  async create(@Body() createRateDto: CreateRateDto, @Request() req: any) {
    return await this.ratesService.create(createRateDto, req.user);
  }

  @Get('my-rates')
  async findMyRates(@Query() query: any, @Request() req: any) {
    return await this.ratesService.findMyRates(query, req.user);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.ratesService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.ratesService.remove(+id, req.user);
  }
}
