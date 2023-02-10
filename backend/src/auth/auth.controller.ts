import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
  Redirect,
  Req,
  Logger,
} from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { LoggedInGuard } from 'src/auth/guard/logged-in.guard';
import { NoLoggedInGuard } from 'src/auth/guard/no-logged-in.guard';
import { Auth42Guard } from 'src/auth/guard/auth42.guard';
import { Jwt2faGuard } from './guard/jwt-2fa.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

//FIXME: change after
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  logger = new Logger('auth.controller');

  @UseGuards(NoLoggedInGuard)
  @Post()
  async create(
    @Body() data: CreateUserDto,
    @Response({ passthrough: true }) res,
  ) {
    const user = await this.userService.create(data);

    res.cookie('accessToken', this.authService.getAccessToken(user.id), {
      httpOnly: true,
      maxAge: process.env.JWT_MAX_AGE,
    });

    return { msg: 'created' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Response({ passthrough: true }) res) {
    res.cookie('accessToken', this.authService.getAccessToken(req.user.id), {
      httpOnly: true,
      maxAge: process.env.JWT_MAX_AGE,
    });
    return { msg: 'logged in' };
  }

  @UseGuards(Auth42Guard)
  @Get('access42')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  access42() {}

  @UseGuards(Auth42Guard)
  @Redirect(process.env.CLIENT_URL, 301)
  @Get('login42')
  async loginWith42(@Request() req, @Response({ passthrough: true }) res) {
    res.cookie('accessToken', this.authService.getAccessToken(req.user.id), {
      httpOnly: true,
      maxAge: process.env.JWT_MAX_AGE,
    });
    return { msg: 'logged in by 42 auth' };
  }

  @UseGuards(LoggedInGuard)
  //@UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    //await this.userService.updateStatus(req.user.id, null);
    res.clearCookie('connect.sid', { httpOnly: true });
    res.clearCookie('accessToken', {
      httpOnly: true,
      maxAge: 0,
    });
    return { msg: 'logged out' };
  }
}
