import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { Follow } from './entities/follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowDto } from './dto/follow.dto';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Follow,User])],
  providers: [FollowService],
  controllers: [FollowController]
})
export class FollowModule {}
