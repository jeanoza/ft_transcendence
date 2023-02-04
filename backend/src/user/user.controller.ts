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

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  logger = new Logger('user.controller');

  @Get()
  async getCurrentUser(@Request() req, @Response({ passthrough: true }) res) {
    return req.user;
  }
}
