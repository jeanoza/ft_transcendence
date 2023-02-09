import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';

@Injectable()
export class FriendService {
  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;

  logger = new Logger('friend service');

  selectOption = [
    'userB.id as id',
    'userB.name as name',
    'userB.status as status',
    'userB.email as email',
    'userB.chat_socket as chat_socket',
    'userB.image_url as image_url',
  ];

  async getAllFriend(userAId: number) {
    const friends = await this.friendRepository
      .createQueryBuilder('friends')
      .innerJoin('friends.userA', 'userA', 'friends.userAId = :userAId', {
        userAId,
      })
      .innerJoin('friends.userB', 'userB')
      .select(this.selectOption)
      .getRawMany();
    return friends;
  }

  async getFriend(userAId: number, userBId: number) {
    const friend = await this.friendRepository
      .createQueryBuilder('friends')
      .innerJoin('friends.userA', 'userA', 'friends.userAId = :userAId', {
        userAId,
      })
      .innerJoin('friends.userB', 'userB', 'friends.userBId = :userBId', {
        userBId,
      })
      .select(this.selectOption)
      .getRawOne();
    return friend;
  }

  async addFriend(userAId: number, userBId: number) {
    let friend = await this.friendRepository.findOne({
      where: { userAId, userBId },
    });

    if (friend) throw new UnauthorizedException('already added');

    friend = new Friend();
    friend.userAId = userAId;
    friend.userBId = userBId;
    const res = await this.friendRepository.save(friend);

    return res;
  }
  async deleteFriend(userAId: number, userBId: number) {
    const friend = await this.getFriend(userAId, userBId);
    if (!friend) throw new UnauthorizedException('no relation between users');
    await this.friendRepository
      .createQueryBuilder('friends')
      .delete()
      .where('friends.user_a_id = :userAId', {
        userAId,
      })
      .andWhere('friends.user_b_id = :userBId', {
        userBId,
      })
      .execute();
  }
}
