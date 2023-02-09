import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blocked } from '../entities/blocked.entity';

@Injectable()
export class BlockedService {
  @InjectRepository(Blocked)
  private blockedRepository: Repository<Blocked>;

  logger = new Logger('blocked service');

  selectOption = [
    'userB.id as id',
    'userB.name as name',
    'userB.status as status',
    'userB.email as email',
    'userB.chat_socket as chat_socket',
    'userB.image_url as image_url',
  ];

  async getAllBlocked(userAId: number) {
    const blockeds = await this.blockedRepository
      .createQueryBuilder('blockeds')
      .innerJoin('blockeds.userA', 'userA', 'blockeds.userAId = :userAId', {
        userAId,
      })
      .innerJoin('blockeds.userB', 'userB')
      .select(this.selectOption)
      .getRawMany();
    return blockeds;
  }

  async getBlocked(userAId: number, userBId: number) {
    const blocked = await this.blockedRepository
      .createQueryBuilder('blockeds')
      .innerJoin('blockeds.userA', 'userA', 'blockeds.userAId = :userAId', {
        userAId,
      })
      .innerJoin('blockeds.userB', 'userB', 'blockeds.userBId = :userBId', {
        userBId,
      })
      .select(this.selectOption)
      .getRawOne();
    return blocked;
  }

  async addBlocked(userAId: number, userBId: number) {
    let blocked = await this.blockedRepository.findOne({
      where: { userAId, userBId },
    });

    if (blocked) throw new UnauthorizedException('already blocked');

    blocked = new Blocked();
    blocked.userAId = userAId;
    blocked.userBId = userBId;
    console.log(blocked);
    const res = await this.blockedRepository.save(blocked);

    return res;
  }
  async deleteBlocked(userAId: number, userBId: number) {
    const blocked = await this.getBlocked(userAId, userBId);
    if (!blocked)
      throw new UnauthorizedException('no relation between users(block)');
    await this.blockedRepository
      .createQueryBuilder('blockeds')
      .delete()
      .where('blockeds.user_a_id = :userAId', {
        userAId,
      })
      .andWhere('blockeds.user_b_id = :userBId', {
        userBId,
      })
      .execute();
  }
}
