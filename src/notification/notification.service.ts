import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from '../notification/dto/notification.dto';
import { User } from 'src/users/entities/user.entity';
import { FirebaseService } from 'src/config/firebase.service';
import { NotificationQueueService } from './queues/notification.queue';
import { NotificationMessages, NotificationType } from './enums/notification-type.enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
    private notificationQueueService: NotificationQueueService,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto, user: User): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user: user,
      type:NotificationType.PROFILE_REMINDER
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
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (!notification) throw new NotFoundException('Notification not found');
    await this.notificationRepository.update(notificationId, { read: true });
  }

  async createAndSendNotification(userId: number, type: NotificationType) {
    // Fetch user’s Firebase token
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const { title, body } = NotificationMessages[type] || NotificationMessages[NotificationType.OTHER];

    if (user.firebaseToken) {
      await this.firebaseService.sendPushNotification(user.firebaseToken, title, body);
    }

    // Save notification in DB
    const notification = this.notificationRepository.create({
      user,
      message: body,
      type,
    });

    await this.notificationRepository.save(notification);
}

async scheduleProfileCompletionNotification(userId: number) {
  console.log("Scheduling Profile Completion Notification for userId =", userId);
  
  const { title, body } = NotificationMessages[NotificationType.PROFILE_REMINDER];

  // 24 hours delay in milliseconds
  const delay = 24 * 60 * 60 * 1000;

  await this.notificationQueueService.addNotificationToQueue(userId, { title, body }, delay);
}

}
