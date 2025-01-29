import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from '../notification/dto/notification.dto';
import { User } from 'src/users/entities/user.entity';
import { FirebaseService } from 'src/config/firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService
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

  async createAndSendNotification(userId: string, title: string, body: string) {
    // Fetch user’s Firebase token from the DB
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (user && user.firebaseToken) {
      await this.firebaseService.sendPushNotification(user.firebaseToken, title, body);
    }
  }

}
