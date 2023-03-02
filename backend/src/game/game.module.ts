import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/services/user.service';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService, GameService, GameGateway],
})
export class GameModule {}
