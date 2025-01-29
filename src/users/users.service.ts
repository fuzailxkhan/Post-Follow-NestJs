import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}
    
      async getUserById(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId.toString() } });
        if (!user) throw new NotFoundException('User not found');
        return user;
      }
    
      async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        await this.userRepository.update(userId, updateProfileDto);
        return this.getUserById(userId);
      }

      async updateFirebaseToken(userId: string, firebaseToken: string): Promise<void> {
        await this.userRepository.update(userId, { firebaseToken });
      }

}
