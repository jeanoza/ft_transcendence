import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'blockeds' })
export class Blocked {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('int', { primary: true, name: 'user_a_id' })
  userAId: number;

  @Column('int', { primary: true, name: 'user_b_id' })
  userBId: number;

  @ManyToOne(() => User, (user) => user.blockedsAsA, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_a_id' })
  userA: User;

  @ManyToOne(() => User, (user) => user.blockedsAsB, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_b_id' })
  userB: User;
}
