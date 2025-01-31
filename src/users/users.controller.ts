import { Controller,Req, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      return this.usersService.getUserById(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('posts-with-profile')
    async getUserProfileWithPosts(@Request() req) {
      return this.usersService.getUserProfileWithPosts(req.user.id);
    }
  
    // Update profile
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
      return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-token')
    updateFirebaseToken(@Req() req, @Body('firebaseToken') firebaseToken: string) {
      return this.usersService.updateFirebaseToken(req.user.id, firebaseToken);
    }
}
