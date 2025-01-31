import { IsNotEmpty, IsString, IsBoolean, IsEnum } from 'class-validator';
import { NotificationType } from '../enums/notification-type.enums';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsEnum(NotificationType, { message: 'Invalid notification type' })
  type: NotificationType;

  @IsBoolean()
  read: boolean;
}
