import { IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  country: string;
}
