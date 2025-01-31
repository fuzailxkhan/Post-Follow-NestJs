import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OTP } from '../entities/otp.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OtpCleanupService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
  ) {}
  
  @Cron('0 * * * *') // Runs every hour
  async cleanupExpiredOtps() {
    await this.otpRepository.delete({ expiresAt: LessThan(new Date()) });
    console.log('Expired OTPs deleted.');
  }
}
