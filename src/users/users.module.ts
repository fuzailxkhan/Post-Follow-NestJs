import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { Notification } from 'src/notification/entities/notification.entity';
import { UserProfile } from './entities/user-profile.entity';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Notification,UserProfile,Post]),UsersModule,NotificationModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule] 
})
export class UsersModule {}
