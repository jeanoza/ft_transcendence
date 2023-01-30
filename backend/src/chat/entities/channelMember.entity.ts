import { User } from 'src/user/entities/user.entity';
import { Channel } from './channel.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'channel_members' })
export class ChannelMember {
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

  @ManyToOne(() => Channel, (channel) => channel.channelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.channelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
