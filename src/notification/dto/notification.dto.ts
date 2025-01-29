import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsBoolean()
  read: boolean;
}
