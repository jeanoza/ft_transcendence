import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

//FIXME: after
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
