import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
