import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column()
  message: string;

  @Column()
  type: string; // For example: 'follow', 'post', etc.

  @Column({ default: false })
  read: boolean; // To track if the notification is read or not

  @CreateDateColumn()
  createdAt: Date;
}
