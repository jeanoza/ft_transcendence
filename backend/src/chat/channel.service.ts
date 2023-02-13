import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from './entities/channelMember.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelChat } from './entities/channelChat.entity';

@Injectable()
export class ChannelService {
  @InjectRepository(Channel)
  private channelRepository: Repository<Channel>;
  @InjectRepository(ChannelMember)
  private channelMemberRepository: Repository<ChannelMember>;
  @InjectRepository(ChannelChat)
  private channelChatRepository: Repository<ChannelChat>;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  /**
   * create/register(if already exist) channel
   * @param data
   */
  async register(data) {
    //find a channel, if no channel => create with data received
    let channel = await this.findByName(data.channel.name);
    if (channel && channel.password !== data.channel.password)
      throw new UnauthorizedException('wrong password');
    if (!channel) channel = await this.create(data.channel);

    await this.registerMember(data.userId, channel.id);
  }

  async registerMember(userId: number, channelId: number) {
    let channelMember = await this.channelMemberRepository.findOne({
      where: { userId, channelId },
    });
    if (!channelMember) {
      channelMember = new ChannelMember();
      channelMember.userId = userId;
      channelMember.channelId = channelId;
      await this.channelMemberRepository.save(channelMember);
    }
    return channelMember;
  }

  async findAllByUserId(userId: number) {
    return await this.channelRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.channelMembers',
        'channelMembers',
        'channelMembers.userId = :userId',
        { userId },
      )
      .select(['channels.id', 'channels.name', 'channels.isPublic'])
      .getMany();
  }

  async findAllChannelChat(channelName) {
    const { id: channelId } = await this.findByName(channelName);
    const channelChat = await this.channelChatRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.user', 'user')
      .innerJoin(
        'channelChats.channel',
        'channel',
        'channelChats.channelId = :channelId',
        { channelId },
      )
      .select([
        'channelChats.content',
        'user.name',
        'user.status',
        'user.imageURL',
      ])
      .orderBy('channelChats.created_at', 'DESC')
      .limit(5)
      .getRawMany();

    const channelChat2 = await this.channelChatRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.user', 'user')
      .innerJoin(
        'channelChats.channel',
        'channel',
        'channelChats.channelId = :channelId',
        { channelId },
      )
      .select([
        'channelChats.content',
        'user.id',
        'user.name',
        'user.status',
        'user.imageURL',
      ])
      .orderBy('channelChats.created_at', 'DESC')
      .limit(5)
      .getMany();

    console.log(channelChat2);
    return channelChat2
      .map((el) => {
        return {
          sender: el.user,
          content: el.content,
        };
      })
      .reverse();
  }

  async saveChannelChat({ userName, content, channelName }) {
    const channel = await this.channelRepository.findOne({
      where: { name: channelName },
    });
    if (!channel) throw new NotFoundException('No channel exist');

    const user = await this.userRepository.findOne({
      where: { name: userName },
    });
    if (!user) throw new NotFoundException('No user exist');

    const channelChat = new ChannelChat();
    channelChat.userId = user.id;
    channelChat.channelId = channel.id;
    channelChat.content = content;
    await this.channelChatRepository.save(channelChat);
  }

  /**
   * Find users in channel
   * @param channelName
   * @returns
   */
  async findAllUserInChannel(channelName: string) {
    const { id: channelId } = await this.findByName(channelName);
    const users = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect(
        'users.channelMembers',
        'channelMembers',
        'channelMembers.channelId = :channelId',
        { channelId },
      )
      .select(['users.name', 'users.status', 'users.imageURL'])
      .getMany();
    return users; //send only username
  }

  //CRUD
  //create
  async create(data) {
    return await this.channelRepository.save(data);
  }

  //read
  //only public?
  async findAll() {
    return await this.channelRepository.createQueryBuilder('channel').getMany();
  }

  async findByName(name: string) {
    return await this.channelRepository
      .findOne({ where: { name }, select: ['id', 'name', 'password'] })
      .catch((e) => {
        console.log(e);
        throw new NotFoundException();
      });
  }

  async findOne(id: number) {
    return await this.channelRepository
      .findOne({ where: { id } })
      .catch((e) => {
        console.log(e);
        throw new NotFoundException();
      });
  }

  //update
  async update(id: number, data) {
    this.findOne(id);
    try {
      this.channelRepository.update(id, { ...data });
      return { msg: 'updated' };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  async delete(id: number) {
    await this.findOne(id);
    return await this.channelRepository.softDelete(id).catch((e) => {
      console.log(e);
      throw new UnauthorizedException();
    });
  }
}
