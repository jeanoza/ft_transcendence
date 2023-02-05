import { Injectable, Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toFileStream } from 'qrcode';

@Injectable()
export class _2faService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  logger = new Logger('_2faService');

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
    await this.userRepository.update(userId, { _2faSecret: secret });
  }
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
  async enable2fa(userId: number) {
    return await this.userRepository.update(userId, { _2faEnabled: true });
  }

  async disable2fa(userId: number) {
    return await this.userRepository.update(userId, {
      _2faEnabled: false,
    });
  }

  validate2faCode(_2faCode: string, user: User) {
    return authenticator.verify({
      token: _2faCode,
      secret: user._2faSecret,
    });
  }
}
