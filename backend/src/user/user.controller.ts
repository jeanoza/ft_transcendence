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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NoLoggedInGuard } from 'src/auth/no-logged-in.guard';
import { Auth42Guard } from 'src/auth/auth42.guard';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentUser(@Request() req) {
    return await this.userService.findByEmail(req.user.email);
  }

  @UseGuards(NoLoggedInGuard)
  @Redirect(process.env.CLIENT_URL, 301)
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    res.cookie('access_token', this.authService.login(req.user), {
      httpOnly: true,
      maxAge: 10 * 1000,
    });
    return { msg: 'success' };
  }

  @UseGuards(Auth42Guard)
  @Get('auth')
  @Redirect(process.env.CLIENT_URL, 301)
  async loginWith42(@Response({ passthrough: true }) res) {
    res.cookie('access_token', this.authService.getAccessToken(), {
      httpOnly: true,
      maxAge: 10 * 1000,
    });
    return { msg: 'success' };
  }

  @UseGuards(LoggedInGuard)
  //@Redirect(process.env.CLIENT_URL, 301)
  @Get('logout')
  async logout(@Response() res) {
    console.log('here');
    res.clearCookie('connect.sid', { httpOnly: true });
    res.clearCookie('access_token', {
      httpOnly: true,
      maxAge: 10 * 1000,
    });
    return { msg: 'ok' };
  }

  //TODO: logout guard

  //@Get()
  //findAll() {
  //  return this.userService.findAll();
  //}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
