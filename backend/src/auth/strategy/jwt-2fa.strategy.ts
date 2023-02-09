import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  logger = new Logger('jwt-2fa');

  async validate(payload) {
    const user = await this.userService.findOne(payload.userId);
    if (!user._2faEnabled) {
      return user;
    }
    if (payload.is2faAuthed) {
      return user;
    }
  }
}
