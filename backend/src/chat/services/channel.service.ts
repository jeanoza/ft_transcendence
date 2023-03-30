import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { ChannelMember } from '../entities/channelMember.entity';
import { User } from '../../user/entities/user.entity';
import { ChannelChat } from '../entities/channelChat.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(ChannelChat)
    private channelChatRepository: Repository<ChannelChat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  logger = new Logger('channelService');

  /**
   * create/register(if already exist) channel
   * @param data
   */
  async register({ channel, userId }) {
    //find a channel, if no channel => create with data received
    let _channel = await this.findByNameWithPassword(channel.name);

    if (
      _channel &&
      !(await bcrypt.compare(channel.password, _channel.password))
    )
      throw new UnauthorizedException('wrong password');

    // if no channel => create
    if (!_channel) _channel = await this.create({ channel, ownerId: userId });

    await this.registerMember(userId, _channel.id);
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
      .select([
        'channels.id',
        'channels.name',
        'channels.isPublic',
        'channels.ownerId',
        'channels.adminIds',
        'channels.bannedIds',
        'channels.mutedIds',
      ])
      .getMany();
  }

  async findAllChannelChat(channelName: string) {
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
        'user.id',
        'user.name',
        'user.status',
        'user.imageURL',
      ])
      .orderBy('channelChats.created_at', 'ASC')
      .getMany();

    return channelChat.map((el) => {
      return {
        sender: el.user,
        content: el.content,
      };
    });
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
      .select([
        'users.id',
        'users.name',
        'users.status',
        'users.imageURL',
        'users.chatSocket',
      ])
      .getMany();
    return users; //send only username
  }

  //CRUD
  //create
  async create({ channel: { name, isPublic, password }, ownerId }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const _channel = new Channel();
    _channel.name = name;
    _channel.isPublic = isPublic;
    _channel.password = hashedPassword;
    _channel.ownerId = ownerId;
    _channel.adminIds = [];
    _channel.bannedIds = [];
    _channel.mutedIds = [];
    return await this.channelRepository.save(_channel);
  }

  //read
  //only public?
  async findAll() {
    return await this.channelRepository.createQueryBuilder('channel').getMany();
  }

  async findByNameWithPassword(name: string) {
    const channel = await this.channelRepository
      .createQueryBuilder('channels')
      .where('channels.name = :name', { name })
      .select(['channels.id', 'channels.name', 'channels.password'])
      .getOne();
    return channel;
  }

  async findByName(name: string) {
    const channel = await this.channelRepository
      .createQueryBuilder('channels')
      .where('channels.name = :name', { name })
      .getOne();
    return channel;
  }

  async findOne(id: number) {
    const channel = await this.channelRepository
      .createQueryBuilder('channels')
      .where('channels.id = :id', { id })
      .getOne();
    if (!channel) throw new NotFoundException();
    return channel;
  }

  async updateChannelPassword(id: number, password: string, isPublic: boolean) {
    const hashed = await bcrypt.hash(password, 12);
    return await this.update(id, { password: hashed, isPublic });
  }

  //update
  async update(id: number, data) {
    try {
      await this.findOne(id);
      await this.channelRepository.update(id, { ...data });
      return { msg: 'updated' };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(e);
    }
  }

  async delete(id: number) {
    await this.findOne(id);
    return await this.channelRepository.softDelete(id).catch((e) => {
      console.log(e);
      throw new UnauthorizedException(e);
    });
  }

  async muteUser(userId: number, channelName: string, milliseconds: number) {
    try {
      const channel = await this.findByName(channelName);
      const mutedIds = channel.mutedIds;
      if (!mutedIds.find((id) => id === userId)) {
        const name = `mute_${userId}_${channelName}`;

        const callback = async () => {
          this.logger.warn(
            `Timeout [${name}] executing after ${milliseconds}!`,
          );
          mutedIds.splice(mutedIds.indexOf(userId), 1);
          try {
            await this.update(channel.id, { mutedIds });
            this.schedulerRegistry.deleteTimeout(name);
          } catch (e) {
            this.logger.log(e);
            throw new UnauthorizedException(e);
          }
        };
        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);

        mutedIds.push(userId);
        await this.update(channel.id, { mutedIds });
      }
    } catch (e) {
      this.logger.log(e);
      throw new UnauthorizedException(e);
    }
  }

  async banUser(userId: number, channelName: string, milliseconds: number) {
    try {
      const channel = await this.findByName(channelName);
      const bannedIds = channel.bannedIds;
      if (!bannedIds.find((id) => id === userId)) {
        const name = `ban_${userId}_${channelName}`;

        const callback = async () => {
          this.logger.warn(
            `Timeout [${name}] executing after ${milliseconds}!`,
          );
          bannedIds.splice(bannedIds.indexOf(userId), 1);
          try {
            await this.update(channel.id, { bannedIds });
            this.schedulerRegistry.deleteTimeout(name);
          } catch (e) {
            this.logger.log(e);
            throw new UnauthorizedException(e);
          }
        };
        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);

        bannedIds.push(userId);
        await this.update(channel.id, { bannedIds });
      }
    } catch (e) {
      this.logger.log(e);
      throw new UnauthorizedException(e);
    }
  }

  async isAdmin(userId: number, channelName: string) {
    const channel = await this.findByName(channelName);
    if (channel.adminIds.find((adminId) => adminId === userId)) return true;
    return false;
  }
  async isOwner(userId: number, channelName: string) {
    const channel = await this.findByName(channelName);
    if (channel.ownerId === userId) return true;
    return false;
  }

  async isBanned(userId: number, channelName: string) {
    const channel = await this.findByName(channelName);
    if (channel?.bannedIds.find((bannedId) => bannedId === userId)) return true;
    return false;
  }

  async isMuted(userId: number, channelName: string) {
    const channel = await this.findByName(channelName);
    if (channel?.mutedIds.find((mutedId) => mutedId === userId)) return true;
    return false;
  }
  async getAllPublic() {
    const res = await this.channelRepository
      .createQueryBuilder('channels')
      .where('channels.isPublic = :isPublic', { isPublic: true })
      .select(['channels.id', 'channels.name'])
      .getMany();
    return res;
  }
}
