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

  @Get('')
  async getAllFriend(@Request() req) {
    console.log('getall', req.user);

    //this.logger.log(req.user.name);

    return await this.friendService.getAllFriend(req.user.id);
    //return { msg: 'get all friend' };
  }

  @Get(':id')
  async addFriend(@Request() req, @Param('id') friendId: number) {
    //this.logger.log(req.user.name);
    console.log('addFriend', req.user);
    //this.logger.log('friend id:', id, typeof id);
    //return { msg: 'add friend' };
    return this.friendService.addFriend(req.user.id, friendId);
  }
}
