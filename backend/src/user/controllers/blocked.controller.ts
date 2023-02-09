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
import { BlockedService } from '../services/blocked.service';

@Controller('api/blocked')
@UseGuards(JwtAuthGuard)
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}
  logger = new Logger('blocked.controller');

  @Get()
  async getAll(@Request() req) {
    return await this.blockedService.getAllBlocked(req.user.id);
  }

  @Post()
  async add(@Request() req, @Body('userId') userId: number) {
    return await this.blockedService.addBlocked(req.user.id, userId);
  }

  @Get(':id')
  async get(@Request() req, @Param('id') userId: number) {
    return await this.blockedService.getBlocked(req.user.id, userId);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') userId: number) {
    return this.blockedService.deleteBlocked(req.user.id, userId);
  }
}
