import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  #accessToken;

  getAccessToken() {
    return this.#accessToken;
  }

  //FIXME: here or user service?
  async addUser42(user): Promise<number> | null {
    const res = await this.userRepository.save(user);
    if (!res) throw new ForbiddenException();
    return res.id;
  }

  //TODO:refactoring with validateUser
  async validateUser42(email: string): Promise<number> | null {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email'],
      });
      if (user) return user.id;
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = { ...user };
    this.#accessToken = this.jwtService.sign(payload);
    return this.#accessToken;
  }
}
