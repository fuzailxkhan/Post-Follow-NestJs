import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { OTP } from '../../auth/entities/otp.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => OTP, (otp) => otp.user)
  otps: OTP[];

  @Column({ nullable: true })
  firebaseToken: string;

  @OneToMany(() => Notification, (notification) => notification.user, { cascade: true })
  notifications: Notification[];

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

}
