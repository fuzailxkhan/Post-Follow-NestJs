import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { User } from 'src/users/entities/user.entity';
import { FirebaseService } from 'src/config/firebase.service';
import { FirebaseModule } from 'src/config/firebase.module';


@Module({
  imports:[TypeOrmModule.forFeature([Notification,User]),FirebaseModule],
  providers: [NotificationService],
  controllers:[NotificationController],
  exports:[]
})
export class NotificationModule {}
