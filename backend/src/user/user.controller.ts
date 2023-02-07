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
import e from 'express';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
//@UseGuards(Jwt2faGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  logger = new Logger('user.controller');

  @Get()
  async getAllUser() {
    return await this.userService.findAll();
  }

  @Get('current')
  async getCurrentUser(@Request() req) {
    return req.user;
  }

  //@Get(':name')
  //async getAllUserByName(@Param('name') name) {
  //  return await this.userService.findAllByName(name);
  //}
  @Get(':id')
  async getUserById(@Param('id') id) {
    return await this.userService.findOne(id);
  }
}
