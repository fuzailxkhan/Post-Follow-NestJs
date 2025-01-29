import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import {Notification} from '../notification/entities/notification.entity'

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async followUser(followerId: string, followedId: string): Promise<Follow> {
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const followed = await this.userRepository.findOne({ where: { id: followedId } });

    if (!follower || !followed) {
      throw new Error('User(s) not found');
    }

    const follow = this.followRepository.create({ follower, followed });
    await this.followRepository.save(follow);
  
    // 🚀 Create a notification for the followed user
    const notification = this.notificationRepository.create({
      user: followed, // Notify the user being followed
      message: `${follower.firstName} started following you!`,
      type: 'follow',
      read: false
    });
  
    await this.notificationRepository.save(notification);
  
    return follow;
  }

  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    if (!follow) {
      throw new Error('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followed: { id: userId } },
      relations: ['follower'],
    });

    return follows.map(follow => follow.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['followed'],
    });

    return follows.map(follow => follow.followed);
  }
}
