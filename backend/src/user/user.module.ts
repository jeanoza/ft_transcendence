import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Friend } from './entities/friend.entity';
import { Blocked } from './entities/blocked.entity';
import { FriendController } from './controllers/friend.controller';
import { UserController } from './controllers/user.controller';
import { BlockedController } from './controllers/blocked.controller';
import { FriendService } from './services/friend.service';
import { UserService } from './services/user.service';
import { BlockedService } from './services/blocked.service';
import { MatchService } from './services/match.service';
import { MatchController } from './controllers/match.controller';
import { Match } from 'src/user/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend, Blocked, Match]),
    JwtModule.register({}),
  ],
  controllers: [
    UserController,
    FriendController,
    BlockedController,
    MatchController,
  ],
  providers: [UserService, FriendService, BlockedService, MatchService],
  exports: [UserService],
})
export class UserModule {}
