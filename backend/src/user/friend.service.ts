import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FriendService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;

  logger = new Logger('friend service');

  async getAllFriend(userAId: number) {
    const friends = await this.friendRepository
      .createQueryBuilder('friends')
      .innerJoin('friends.userA', 'userA', 'friends.userAId = :userAId', {
        userAId,
      })
      .innerJoin('friends.userB', 'userB')
      .select([
        'userB.id as id',
        'userB.name as name',
        'userB.status as status',
        'userB.chat_socket as chat_socket',
      ])
      .getRawMany();
    return friends;
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
}
