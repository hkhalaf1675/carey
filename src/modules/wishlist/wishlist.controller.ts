import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Request() req: any) {
    return await this.wishlistService.create(createWishlistDto, req.user);
  }

  @Get('my-wishlist')
  async findMyWishlist(@Query() query: any, @Request() req: any) {
    return await this.wishlistService.findMyWishlist(req.user, query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.wishlistService.remove(+id, req.user);
  }
}
