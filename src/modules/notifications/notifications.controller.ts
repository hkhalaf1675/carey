import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Query() query: any, @Request() req: any) {
    return await this.notificationsService.findAll(query, req.user);
  }

  @Get('unseen-count')
  async getUnseenCount(@Request() req: any) {
    return await this.notificationsService.getUnseenCount(req.user);
  }

  @Patch('change-seen')
  async update(@Request() req: any) {
    return await this.notificationsService.update(req.user);
  }
}
