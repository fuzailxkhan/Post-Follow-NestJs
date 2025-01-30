import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { FirebaseService } from 'src/config/firebase.service';

@Processor('notification')
@Injectable()
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Process('send-notification')
  async handleSendNotification(job: Job) {
    console.log("Handle Send Notification => notification.processor")

    const { userId, notificationDetails } = job.data;

    // Fetch user token from the database
    const userToken = 'eD8PQschXVjaeNqFyCZpkz:APA91bEFX6ezOQLWvt-gQM7GZJFJ2_SxczGSlzt6u7EvkIt0gOkXIYwTUFg0yhFCrSY2aGocy9EpzMj6mnkUIiok_m3UM8QpsxA0yjPsGxgkx7-RQAOK_w0'; // Replace with actual database query
    
    if (userToken) {
      try {
        await this.firebaseService.sendPushNotification(userToken, notificationDetails.title, notificationDetails.body);
        this.logger.log(`Notification sent to user: ${userId}`);
      } catch (error) {
        this.logger.error(`Failed to send notification to user: ${userId}`, error);
      }
    }
  }
}
