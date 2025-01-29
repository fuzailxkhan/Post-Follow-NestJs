import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import { Follow } from 'src/follow/entities/follow.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepository.create({ ...createPostDto, user });
    return await this.postRepository.save(post);
  }

  async getUserPosts(user: User): Promise<Post[]> {
    return await this.postRepository.find({ where: { user }, order: { createdAt: 'DESC' } });
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.find({ relations: ['user'], order: { createdAt: 'DESC' } });
  }

  async getNewsfeed(user: User, page: number, limit: number): Promise<Post[]> {
    // Get IDs of users that the current user follows
    const followedUsers = await this.followRepository.find({
      where: { follower: { id: user.id } },
      relations: ['followed'],
    });
  
    const followedUserIds = followedUsers.map((follow) => follow.followed.id);
  
    if (followedUserIds.length === 0) return []; // Return empty if user follows no one
  
    // Get posts from followed users
    return await this.postRepository.find({
      where: { user: { id: In(followedUserIds) } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit, // Pagination
    });
  }
  
}
