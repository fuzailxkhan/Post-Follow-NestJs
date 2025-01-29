import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service'
import { CreateNotificationDto } from '../notification/dto/notification.dto'
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { UseGuards, Req } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() req,
  ) {
    return this.notificationsService.createNotification(createNotificationDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserNotifications(@Req() req) {
    return this.notificationsService.getUserNotifications(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markAsRead(@Param('id') notificationId: number) {
    return this.notificationsService.markAsRead(notificationId);
  }
}
