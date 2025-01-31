import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service'
import { CreateNotificationDto } from '../notification/dto/notification.dto'
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { UseGuards, Req } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() req,
  ) {
    return this.notificationService.createNotification(createNotificationDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserNotifications(@Req() req) {
    return this.notificationService.getUserNotifications(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markAsRead(@Param('id') notificationId: number) {
    return this.notificationService.markAsRead(notificationId);
  }

  @Post('/test/:userId')
  async testNotification(@Param('userId') userId: string) {
    await this.notificationService.scheduleProfileCompletionNotification(Number(userId));
    return { message: 'Test notification scheduled!' };
  }
}
