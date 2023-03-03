import {
  Controller,
  Get,
  UseGuards,
  Request,
  Logger,
  Post,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MatchService } from '../services/match.service';

@Controller('api/match')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}
  logger = new Logger('blocked.controller');

  @Get()
  async getAll(@Request() req) {
    //return await this.matchService.
  }

  @Get(':id')
  async get(@Request() req, @Param('id') userId: number) {
    //return await this.matchService.getBlocked(req.user.id, userId);
  }
}
