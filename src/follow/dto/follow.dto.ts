import { IsNotEmpty } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  followedId: string;
}
