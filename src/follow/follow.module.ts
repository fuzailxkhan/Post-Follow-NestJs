import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { Follow } from './entities/follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowDto } from './dto/follow.dto';
import { User } from 'src/users/entities/user.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationQueueService } from 'src/notification/queues/notification.queue';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports:[TypeOrmModule.forFeature([Follow,User,Notification,UserProfile]),
          NotificationModule],
  providers: [FollowService],
  controllers: [FollowController]
})
export class FollowModule {}
