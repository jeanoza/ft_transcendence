import { ChannelChat } from 'src/chat/entities/channelChat.entity';
import { ChannelMember } from 'src/chat/entities/channelMember.entity';
import { Note } from 'src/note/entities/note.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Friend } from './friend.entity';

//in postgresql do not put schema
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ nullable: true, name: '_2fa_secret' })
  _2faSecret?: string;

  @Column({ default: false, name: '_2fa_enabled' })
  _2faEnabled: boolean;

  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', {
    name: 'password',
    length: 100,
    select: false,
    nullable: true,
  })
  password?: string;

  @Column('varchar', {
    name: 'chat_socket',
    length: 100,
    nullable: true,
  })
  chatSocket?: string;

  @Column('int', { name: 'status', nullable: true })
  status?: number;

  @Column('varchar', { name: 'image_url', length: 500 })
  imageURL: string;

  @Column('varchar', {
    name: 'login',
    unique: true,
    length: 30,
    nullable: true,
  })
  login?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Note, (note) => note.author)
  notes: Note[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user)
  channelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.user)
  channelChats: ChannelChat[];

  @OneToMany(() => Friend, (friend) => friend.userA)
  friendsAsA: Friend[];

  @OneToMany(() => Friend, (friend) => friend.userB)
  friendsAsB: Friend[];
}
