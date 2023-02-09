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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend, Blocked]),
    JwtModule.register({}),
  ],
  controllers: [UserController, FriendController, BlockedController],
  providers: [UserService, FriendService, BlockedService],
  exports: [UserService],
})
export class UserModule {}
