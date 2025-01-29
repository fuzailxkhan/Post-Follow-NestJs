import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from '../notification/dto/notification.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto, user: User): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user: user,
    });
    return await this.notificationRepository.save(notification);
  }

  async getUserNotifications(user: User): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { read: true });
  }
}
