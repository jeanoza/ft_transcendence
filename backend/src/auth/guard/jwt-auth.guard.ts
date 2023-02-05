import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
