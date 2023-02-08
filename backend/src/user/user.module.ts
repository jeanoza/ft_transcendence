import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Friend } from './entities/friend.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend]), JwtModule.register({})],
  controllers: [UserController, FriendController],
  providers: [UserService, FriendService],
  exports: [UserService],
})
export class UserModule {}
