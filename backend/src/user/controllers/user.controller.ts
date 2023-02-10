import {
  Controller,
  Get,
  UseGuards,
  Request,
  Logger,
  Param,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
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
  async getUserById(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data) {
    return await this.userService.update(id, data);
  }
}
