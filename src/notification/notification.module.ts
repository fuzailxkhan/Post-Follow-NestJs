import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { User } from 'src/users/entities/user.entity';
import { FirebaseService } from 'src/config/firebase.service';
import { FirebaseModule } from 'src/config/firebase.module';
import { NotificationCleanupService } from './notification.cleanup-service';
import { NotificationProcessor } from './processors/notification.processor';
import { BullModule } from '@nestjs/bull';
import { NotificationQueueService } from './queues/notification.queue';


@Module({
  imports:[
    BullModule.registerQueue({
    name: 'notification',
  }),
  TypeOrmModule.forFeature([Notification,User]),
  FirebaseModule],

  providers: [NotificationService,NotificationCleanupService,NotificationProcessor,NotificationQueueService],
  controllers:[NotificationController],
  exports:[NotificationQueueService]
})
export class NotificationModule {}
