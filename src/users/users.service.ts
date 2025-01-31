import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId }, 
      relations: ['profile'] 
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.getUserById(userId);
    if (!user.profile) {
      user.profile = this.profileRepository.create({ user });
    }
    await this.profileRepository.save({ ...user.profile, ...updateProfileDto });
    return this.getUserById(userId);
  }

  async updateFirebaseToken(userId: string, firebaseToken: string): Promise<void> {
    await this.userRepository.update(userId, { firebaseToken });
  }

  async getUserProfileWithPosts(userId: number, page: number = 1, limit: number = 10) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');
    
    // Fetch the user's posts with pagination
    const [posts, totalPosts] = await this.postRepository.findAndCount({
      where: { user: user },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        verified: user.verifiedProfile,  // Including profile info
      },
      posts: posts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };
  }
}
