import { ForbiddenException, Injectable } from '@nestjs/common';
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

  #accessToken: string;

  /**
   * Getter
   * @returns accessToken
   */
  getAccessToken(): string {
    return this.#accessToken;
  }

  /**
   * Add user identificated to database by 42 auth
   * @param user
   * @returns
   */
  //FIXME: here or user service?
  async addUser42(user): Promise<User> | undefined {
    const ret = await this.userRepository.save(user);
    if (!ret) throw new ForbiddenException('addUser42 failed');
    return ret;
  }

  /**
   * Validate User(local or auth42)
   * @param email
   * @param _password
   * @returns
   */
  async validateUser(
    email: string,
    _password: string | undefined = undefined,
  ): Promise<User> | null {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'login'],
    });

    if (user) {
      // validate only two case
      // 1. 42 auth login : login && no _password put by user
      // 2. local login : no login && _password
      if (
        (user.login && !_password) ||
        (!user.login &&
          _password &&
          (await bcrypt.compare(_password, user.password)))
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, login, ...rest } = user;
        return rest;
      }
    }
    return null;
  }

  /**
   * Generate accessToken via jwt and save it as private attribute
   * @param user
   * @returns
   */
  login(user: any): string {
    const payload = { ...user };
    this.#accessToken = this.jwtService.sign(payload);
    return this.#accessToken;
  }
}
