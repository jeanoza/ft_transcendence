import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'dms' })
export class DM {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column('int', { nullable: true, name: 'sender_id' })
  senderId: number | null;

  @Column('int', { nullable: true, name: 'receiver_id' })
  receiverId: number | null;

  @ManyToOne(() => User, (user) => user.dmsAsSender, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.dmsAsReceiver, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id', referencedColumnName: 'id' })
  receiver: User;
}
