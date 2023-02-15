import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { DM } from './entities/dm.entity';

@Injectable()
export class DMService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DM)
    private dmRepository: Repository<DM>,
  ) {}

  async createDM(senderId: number, receiverId: number, content: string) {
    try {
      const sender = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :senderId', { senderId })
        .getOne();
      const receiver = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :receiverId', { receiverId })
        .getOne();
      if (!(sender && receiver))
        throw new UnauthorizedException('no exist sender or receiver');

      const dm = new DM();
      dm.senderId = senderId;
      dm.receiverId = receiverId;
      dm.content = content;
      await this.dmRepository.save(dm);
      return dm;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  //FIXME: not performance at all => to find a way with sql query
  async getAllDmUsersByCurrentUserId(userId: number) {
    const ids = new Set();
    const dms = await this.getAllByUserId(userId);
    dms.forEach((el) => {
      if (el.receiverId !== userId) ids.add(el.receiverId);
      else if (el.senderId !== userId) ids.add(el.senderId);
    });

    return Promise.all(
      Array.from(ids).map((el: number) =>
        this.userRepository.findOne({ where: { id: el } }),
      ),
    );
  }

  async getAllByUserId(userId: number) {
    const dms = await this.dmRepository
      .createQueryBuilder('dms')
      .where('dms.senderId = :userId', {
        userId,
      })
      .orWhere('dms.receiverId = :userId', {
        userId,
      })
      .getMany();
    return dms;
  }
}
