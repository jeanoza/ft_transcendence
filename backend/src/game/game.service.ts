import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from './room';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  rooms = new Map<string, Room>();
  logger = new Logger('gameService');

  async createRoom(roomName: string, homeId: number, awayId: number) {
    const home = await this.userRepository.findOne({
      where: { id: homeId },
    });
    const away = await this.userRepository.findOne({
      where: { id: awayId },
    });
    const room = new Room(home, away, roomName);

    this.rooms.set(roomName, room);
  }
}
