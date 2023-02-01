import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from './entities/channelMember.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChannelService {
  @InjectRepository(Channel)
  private channelRepository: Repository<Channel>;
  @InjectRepository(ChannelMember)
  private channelMemberRepository: Repository<ChannelMember>;
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
      .select(['users.name'])
      .getMany();
    return users.map((el) => el.name); //send only username
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
