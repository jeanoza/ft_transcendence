import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';

@Injectable()
export class FriendService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(Friend)
  private friendRepository: Repository<Friend>;

  logger = new Logger('friend service');

  async getAllFriend(userId: number) {
    //const res = await this.friendRepository
    //  .createQueryBuilder('friends')
    //  .innerJoin('friends.user', 'user', 'friends.userId = :userId', {
    //    userId,
    //  })
    //  .getMany();

    const res = await await this.userRepository.find({ where: { userId } });

    console.log(res);

    return { msg: 'not yet' };
  }

  async addFriend(userId: number, friendId: number) {
    let friend = await this.friendRepository.findOne({
      where: { userId, friendId },
    });
    if (friend) throw new ForbiddenException('already added');

    friend = new Friend();
    friend.userId = userId;
    friend.friendId = friendId;
    const res = await this.friendRepository.save(friend);

    return res;
  }
}
