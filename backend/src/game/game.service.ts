import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from './room';
import { Match } from '../user/entities/match.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  rooms = new Map<string, Room>();
  waitings = new Map<number, string>();
  logger = new Logger('gameService');

  async createRoom(roomName: string, homeId: number, awayId: number) {
    const home = await this.userRepository.findOne({
      where: { id: homeId },
    });
    const away = await this.userRepository.findOne({
      where: { id: awayId },
    });
    const room = new Room(home, away, roomName);
    room.addParticipant(homeId);
    room.addParticipant(awayId);
    this.rooms.set(roomName, room);
    return room;
  }

  async updateMatchResult(room: Room) {
    const score = room.getScore();
    const { id: winnerId } = room.getWinner();
    const { id: loserId } = room.getLoser();
    const scoreArray = [score.home, score.away];
    try {
      await this.updateMatchHistory(winnerId, loserId, scoreArray);
      await this.updateRank(winnerId, true);
      await this.updateRank(loserId, false);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateMatchHistory(winnerId: number, loserId: number, score: number[]) {
    const match = new Match();
    match.winnerId = winnerId;
    match.loserId = loserId;
    match.score = score;
    return await this.matchRepository.save(match);
  }

  async updateRank(id: number, isWinner: boolean) {
    const { rank } = await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne();
    const nextRank = isWinner ? rank + 15 : rank - 10;
    return await this.userRepository.update(id, { rank: nextRank });
  }

  findUser(currentId: number): number | null {
    let otherId = null;
    this.waitings.forEach((value, key) => {
      if (key !== currentId) otherId = key;
    });
    return otherId;
  }

  addWaiting(id: number, socketId: string) {
    this.waitings.set(id, socketId);
  }
  deleteWaiting(id: number) {
    this.waitings.delete(id);
  }
  getObserversInRoom(roomName: string) {
    const room = this.rooms.get(roomName);
    if (room) {
      const home = room.getHome();
      const away = room.getAway();
      const participants = Array.from(room.getParticipants());
      if (home && away && participants) {
        const observers = participants.filter(
          (participant) =>
            !(participant === home.id || participant === away.id),
        );
        //console.log(observers);
        return observers;
      }
    }
    return [];
  }
}
