import { Queue, Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class NotificationQueueService {
  constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

  async addNotificationToQueue(userId: number, notificationDetails: any, delay: number) {
    console.log("Add Notification To Queue => notificaiton.queue")
    await this.notificationQueue.add('send-notification', {
      userId,
      notificationDetails,
    }, {
      delay,  // Delay in milliseconds (e.g., 24 hours = 86400000 ms)
    });
  }
}
