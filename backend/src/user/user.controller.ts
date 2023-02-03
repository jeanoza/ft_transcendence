import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@Request() req, @Response({ passthrough: true }) res) {
    const user = await this.userService.findByEmail(req.user.email);
    if (!user)
      res.clearCookie('accessToken', {
        httpOnly: true,
        maxAge: 0,
      });
    return user;
  }
}
