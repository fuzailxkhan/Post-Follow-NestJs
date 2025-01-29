import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    console.log('JWT_SECRET:', this.configService.get('JWT_SECRET'));

  }

  async signup(signupDto: SignupDto): Promise<string> {
    const { email, password, firstName, lastName, country } = signupDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      country,
    });

    await this.userRepository.save(user);
    console.log("This User Just Signed Up ==> " ,user.email)
    return 'User registered successfully';
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await this.userRepository.save(user);

    console.log(`OTP for ${email}: ${otp}`); // Printing OTP in console

    return 'OTP has been generated and printed in console';
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    const { email, otp } = verifyOtpDto;

    const secret = this.configService.get('JWT_SECRET');
    console.log("JWT_SECRET in verifyOtp:", secret);
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    console.log("This User OTP Checking ",user?.email)
    if (!user || user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful login
    user.otp = '';
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { userId: user.id, email: user.email };
    // Explicitly pass the secret to the sign method
    const accessToken = this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET') });


    return { accessToken };
  }
}
