import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DM } from '../entities/dm.entity';
import { Blocked } from 'src/user/entities/blocked.entity';

@Injectable()
export class DMService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DM)
    private dmRepository: Repository<DM>,
    @InjectRepository(Blocked)
    private blockedRepository: Repository<Blocked>,
  ) {}

  logger = new Logger('DMService');

  async createDM(senderId: number, receiverId: number, content: string) {
    try {
      const sender = await this.userRepository
        .createQueryBuilder('users')
        .where('users.id = :senderId', { senderId })
        .getOne();
      const receiver = await this.userRepository
        .createQueryBuilder('users')
        .where('users.id = :receiverId', { receiverId })
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
      Array.from(ids).map(async (id: number) => {
        return this.userRepository.findOne({ where: { id } }).then((res) => {
          return {
            id: res.id,
            name: res.name,
            status: res.status,
            imageURL: res.imageURL,
          };
        });
      }),
    );
  }

  async getAllByUserId(userId: number) {
    const dms = await this.dmRepository
      .createQueryBuilder('dms')
      .where('dms.sender_id = :userId', {
        userId,
      })
      .orWhere('dms.receiver_id = :userId', {
        userId,
      })
      .getMany();
    return dms;
  }

  async getAllBetweenUser(userId: number, otherId: number) {
    const dms = await this.dmRepository
      .createQueryBuilder('dms')
      .innerJoinAndSelect('dms.sender', 'sender')
      .innerJoinAndSelect('dms.receiver', 'receiver')
      .where(
        `((dms.sender_id = :userId AND dms.receiver_id = :otherId)
				OR (dms.receiver_id = :userId AND dms.sender_id = :otherId))`,
        { userId, otherId },
      )
      .orderBy('dms.createdAt', 'ASC')
      .getMany();
    const blocked = await this.blockedRepository
      .createQueryBuilder('blockeds')
      .where('blockeds.user_a_id = :userId AND blockeds.user_b_id = :otherId', {
        userId,
        otherId,
      })
      .getOne();

    if (blocked) return dms.filter((el) => el.sender.id != otherId);
    return dms;
  }

  async deleteAllBetweenUser(userId: number, otherId: number) {
    await this.dmRepository
      .createQueryBuilder('dms')
      .delete()
      .where(
        '((dms.sender_id = :userId AND dms.receiver_id = :otherId) OR (dms.receiver_id = :userId AND dms.sender_id = :otherId))',
        { userId, otherId },
      )
      .execute();
  }
}
