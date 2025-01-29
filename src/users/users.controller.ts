import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
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
  
    // Update profile
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
      return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }
}
