import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { Notification } from 'src/notification/entities/notification.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Notification]),UsersModule,NotificationModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule] 
})
export class UsersModule {}
