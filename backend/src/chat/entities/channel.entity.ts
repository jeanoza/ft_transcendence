import { ChannelMember } from './channelMember.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChat } from './channelChat.entity';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @Column('int', { name: 'owner_id' })
  ownerId: number;

  @Column('varchar', {
    name: 'password',
    length: 100,
    select: false,
    nullable: true,
  })
  password?: string;

  @Column('boolean', {
    name: 'is_public',
  })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channel)
  channelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.channel)
  channelChats: ChannelChat[];
}
