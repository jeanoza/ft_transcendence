import { User } from 'src/user/entities/user.entity';
import { Channel } from './channel.entity';
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

@Entity({ name: 'channel_chats' })
export class ChannelChat {
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

  @Column('int', { primary: true, name: 'channel_id' })
  channelId: number;

  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => Channel, (channel) => channel.channelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.channelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
