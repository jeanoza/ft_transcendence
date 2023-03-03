import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/services/user.service';
import { GameService } from './game.service';
import { Match } from '../user/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  controllers: [],
  providers: [UserService, GameService, GameGateway],
})
export class GameModule {}
