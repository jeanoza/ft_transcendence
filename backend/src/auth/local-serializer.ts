import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    return this.userRepository
      .findOneOrFail({
        where: { id: +userId },
        select: ['id', 'email', 'name'],
        //select: ['id', 'email'],
      })
      .then((user) => {
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
