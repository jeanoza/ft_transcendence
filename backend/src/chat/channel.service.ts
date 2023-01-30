import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  @InjectRepository(Channel)
  private channelRepository: Repository<Channel>;

  //CRUD
  //create
  async create(data) {
    return await this.channelRepository.save(data).catch((e) => {
      console.log(e);
      throw new UnauthorizedException();
    });
  }

  //read
  //only public?
  async findAll() {
    return await this.channelRepository
      .createQueryBuilder('channel')
      .select(['name'])
      .getMany();
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
