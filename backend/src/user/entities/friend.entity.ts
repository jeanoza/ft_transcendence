import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'friends' })
export class Friend {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column('int', { primary: true, name: 'user_a_id' })
  userAId: number;

  @Column('int', { primary: true, name: 'user_b_id' })
  userBId: number;

  @ManyToOne(() => User, (user) => user.friendsAsA, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_a_id' })
  userA: User;

  @ManyToOne(() => User, (user) => user.friendsAsB, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_b_id' })
  userB: User;
}
