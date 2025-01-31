import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { User } from '../users/entities/user.entity';
import { OTP } from './entities/otp.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserProfile } from '../users/entities/user-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<string> {
    const { email, password, firstName, lastName, country } = signupDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('Email is already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ email, password: hashedPassword });
    await this.userRepository.save(user);

    const profile = this.profileRepository.create({ user, firstName, lastName, country });
    await this.profileRepository.save(profile);

    console.log("User Signed Up ==> ", user.email);
    return 'User registered successfully';
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('Invalid credentials');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    await this.otpRepository.save(this.otpRepository.create({ user, otp, expiresAt }));

    console.log(`OTP for ${email}: ${otp}`);
    return 'OTP has been generated and printed in console';
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    const { email, otp } = verifyOtpDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid OTP');

    const storedOtp = await this.otpRepository.findOne({ where: { user, otp } });
    if (!storedOtp || storedOtp.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.otpRepository.remove(storedOtp); // Delete OTP after use

    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET') });

    return { accessToken };
  }
}
