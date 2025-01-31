import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { NotificationType } from 'src/notification/enums/notification-type.enums';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,

    private notificationService: NotificationService
  ) {}

  async followUser(followerId: number, followedId: number): Promise<Follow> {
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const followed = await this.userRepository.findOne({ where: { id: followedId } });

    if (!follower || !followed) {
      throw new NotFoundException('User not found');
    }

    const follow = this.followRepository.create({ follower, followed });
    await this.followRepository.save(follow);

    // Fetch follower’s profile for the notification message
    const followerProfile = await this.userProfileRepository.findOne({ where: { user: follower } });

    if (followerProfile) {
      // 🚀 Send a notification to the followed user
      await this.notificationService.createAndSendNotification(
        followed.id,NotificationType.FOLLOW
      );
    }

    return follow;
  }

  async unfollowUser(followerId: number, followedId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followed: { id: userId } },
      relations: ['follower'],
    });

    return follows.map(follow => follow.follower);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['followed'],
    });

    return follows.map(follow => follow.followed);
  }
}
