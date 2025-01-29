import { Controller,Req, Post, Delete, Body, Param, Get, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  follow(@Body() followDto: FollowDto, @Req() req) {
    return this.followService.followUser(req.user.id, followDto.followedId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unfollow(@Body() followDto: FollowDto, @Req() req) {
    return this.followService.unfollowUser(req.user.id, followDto.followedId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }
}
