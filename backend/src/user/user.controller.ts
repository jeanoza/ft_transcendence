import {
  Controller,
  Get,
  UseGuards,
  Request,
  Response,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Jwt2faGuard } from 'src/auth/guard/jwt-2fa.guard';

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
}
