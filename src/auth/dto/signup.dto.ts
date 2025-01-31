import { IsEmail, IsNotEmpty, MinLength, Matches, MaxLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(64,{message:"Password can not be longer then 64 characters"})
  password: string;
}
