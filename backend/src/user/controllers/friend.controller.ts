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
import { FriendService } from '../services/friend.service';

@Controller('api/friend')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  logger = new Logger('friend.controller');

  @Get()
  async getAll(@Request() req) {
    return await this.friendService.getAllFriend(req.user.id);
  }

  @Post()
  async add(@Request() req, @Body('userId') userId: number) {
    return await this.friendService.addFriend(req.user.id, userId);
  }

  @Get(':id')
  async get(@Request() req, @Param('id') userId: number) {
    return await this.friendService.getFriend(req.user.id, userId);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') userId: number) {
    return this.friendService.deleteFriend(req.user.id, userId);
  }
}
