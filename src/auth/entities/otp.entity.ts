import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  otp: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
