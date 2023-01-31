import {
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

  async join(data) {
    try {
      //find a channel, if no channel => create with data received
      let channel = await this.findByName(data.channel.name);
      if (channel && channel.password !== data.channel.password) {
        console.log(channel, data.channel.password);
        throw new UnauthorizedException('wrong password');
      }
      if (!channel) channel = await this.create(data.channel);

      //put relation between user and current channel then save

      let channelMember = await this.channelMemberRepository.findOne({
        where: { userId: data.userId },
      });
      if (!channelMember) {
        channelMember = new ChannelMember();
        channelMember.userId = data.userId;
        channelMember.channelId = channel.id;
        await this.channelMemberRepository.save(channelMember);
      }
      console.log(channelMember);
    } catch (e) {
      //console.log(e);
      throw e;
    }
  }

  //CRUD
  //create
  async create(data) {
    //let isPublic = true;
    //if (data.password.length) isPublic = false;
    return await this.channelRepository.save(data).catch((e) => {
      console.log(e);
      throw new UnauthorizedException();
    });
  }

  //read
  //only public?
  async findAll() {
    return await this.channelRepository.createQueryBuilder('channel').getMany();
  }

  async findAllPublicChanList() {
    const channels = await this.channelRepository
      .createQueryBuilder('channel')
      .select(['channel.name', 'channel.id'])
      .where('channel.isPublic = :isPublic', { isPublic: true })
      .getMany();
    return channels;
  }

  async findByName(name: string) {
    return await this.channelRepository
      .findOne({ where: { name }, select: ['name', 'password'] })
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
