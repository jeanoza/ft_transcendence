import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService, GameGateway],
})
export class GameModule {}
