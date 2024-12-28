import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { RateReactsService } from './rate-reacts.service';
import { CreateRateReactDto } from './dto/create-rate-react.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('rate-reacts')
@UseGuards(AuthGuard)
export class RateReactsController {
  constructor(private readonly rateReactsService: RateReactsService) {}

  @Post()
  async create(@Body() createRateReactDto: CreateRateReactDto, @Request() req: any) {
    return await this.rateReactsService.create(createRateReactDto, req.user);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.rateReactsService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.rateReactsService.remove(+id, req.user);
  }

  @Delete()
  async removeByRate(@Query('rateId') rateId: string, @Request() req: any) {
    return await this.rateReactsService.removeByRate(+rateId, req.user);
  }
}
