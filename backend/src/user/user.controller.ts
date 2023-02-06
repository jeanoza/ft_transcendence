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

@Controller('api/user')
@UseGuards(JwtAuthGuard)
//@UseGuards(Jwt2faGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  logger = new Logger('user.controller');

  @Get()
  async getCurrentUser(@Request() req, @Response({ passthrough: true }) res) {
    return req.user;
  }

  @Get('all')
  async getAllUser() {
    return await this.userService.findAll();
  }

  @Get(':name')
  async getAllUserByName(@Param('name') name) {
    return await this.userService.findAllByName(name);
  }
}
