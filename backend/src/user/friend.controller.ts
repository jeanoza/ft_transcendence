import {
  Controller,
  Get,
  UseGuards,
  Request,
  Response,
  Logger,
  Post,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FriendService } from './friend.service';

@Controller('api/friend')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}
  logger = new Logger('friend.controller');

  @Get()
  async getAllFriend(@Request() req) {
    return await this.friendService.getAllFriend(req.user.id);
    //return { msg: 'get all friend' };
  }

  @Post()
  async addFriend(@Request() req, @Body('userId') userId: number) {
    this.logger.log(userId);
    console.log('addFriend', userId);
    //this.logger.log('friend id:', id, typeof id);
    //return { msg: 'add friend' };
    return this.friendService.addFriend(req.user.id, userId);
  }

  @Get(':id')
  async getFriend(@Request() req) {
    return { msg: 'got' };
  }
}
