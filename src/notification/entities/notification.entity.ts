import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';


@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  message: string;

  @Column()
  type: string; // Example: 'follow', 'post', 'profile-reminder', etc.

  @Column({ default: false })
  read: boolean; // Mark if the user has seen the notification

  @CreateDateColumn()
  createdAt: Date;


  
}
