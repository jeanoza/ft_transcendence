import { Channel } from 'src/chat/entities/channel.entity';
import { ChannelChat } from 'src/chat/entities/channelChat.entity';
import { ChannelMember } from 'src/chat/entities/channelMember.entity';
import { Note } from 'src/note/entities/note.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//in postgresql do not put schema
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

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

  @Column('varchar', { name: 'image_url', length: 500, nullable: true })
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

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.channel)
  channelChats: ChannelChat[];

  //@ManyToMany(() => Channel, (channel) => channel.members)
  //@JoinTable({
  //  name: 'channel_members',
  //  joinColumn: {
  //    name: 'user_id',
  //    referencedColumnName: 'id',
  //  },
  //  inverseJoinColumn: {
  //    name: 'channel_id',
  //    referencedColumnName: 'id',
  //  },
  //})
  //channels: Channel[];
}
