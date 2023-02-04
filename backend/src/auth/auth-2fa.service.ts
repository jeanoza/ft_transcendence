import { Injectable, Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toFileStream } from 'qrcode';

@Injectable()
export class Auth2faService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  logger = new Logger('auth2faService');

  async generate2faSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      process.env.APP_NAME,
      secret,
    );

    await this.set2faSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }
  async set2faSecret(secret: string, userId: number) {
    await this.userRepository.update(userId, { twoFactorSecret: secret });
  }
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    this.logger.log(otpauthUrl);
    return toFileStream(stream, otpauthUrl);
  }
  async enable2fa(userId: number) {
    return await this.userRepository.update(userId, { twoFactorEnabled: true });
  }

  async disable2fa(userId: number) {
    return await this.userRepository.update(userId, {
      twoFactorSecret: null,
      twoFactorEnabled: false,
    });
  }

  validate2faCode(twoFactorCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: user.twoFactorSecret,
    });
  }
}
