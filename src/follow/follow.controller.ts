import { 
  Controller, Req, Post, Delete, Body, Param, Get, UseGuards 
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard) // ✅ Apply JWT Guard globally
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async follow(@Body() followDto: FollowDto, @Req() req: Request) {
    if (!req.user) throw new Error('Unauthorized: No user found in request');
    const userId = Number(req.user['id']);
    return this.followService.followUser(userId, Number(followDto.followedId));
  }

  @Delete()
  async unfollow(@Body() followDto: FollowDto, @Req() req: Request) {
    if (!req.user) throw new Error('Unauthorized: No user found in request');
    const userId = Number(req.user['id']);
    return this.followService.unfollowUser(userId, Number(followDto.followedId));
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: number) {
    return this.followService.getFollowers(userId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: number) {
    return this.followService.getFollowing(userId);
  }
}
