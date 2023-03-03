import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/user/entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  logger = new Logger('match service');

  async getAllMatch(id: number) {
    const matches = await this.matchRepository
      .createQueryBuilder('matches')
      .innerJoinAndSelect('matches.winner', 'winner')
      .innerJoinAndSelect('matches.loser', 'loser')
      .where(`matches.winner_id = :id OR matches.loser_id = :id`, { id })
      .orderBy('matches.createdAt', 'DESC')
      .select(['matches.score', 'matches.createdAt', 'winner', 'loser'])
      .getMany();
    return matches;
  }
}
