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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { LoggedInGuard } from 'src/auth/guard/logged-in.guard';
import { NoLoggedInGuard } from 'src/auth/guard/no-logged-in.guard';
import { Auth42Guard } from 'src/auth/guard/auth42.guard';

const MAX_AGE = 24 * 60 * 60 * 1000; // one day

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(NoLoggedInGuard)
  @Post()
  async create(
    @Body() data: CreateUserDto,
    @Response({ passthrough: true }) res,
  ) {
    const user = await this.userService.create(data);

    res.cookie('accessToken', this.authService.login(user), {
      httpOnly: true,
      maxAge: MAX_AGE,
    });

    return { msg: 'created' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Response({ passthrough: true }) res) {
    res.cookie('accessToken', this.authService.login(req.user), {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return { msg: 'success' };
  }

  @UseGuards(Auth42Guard)
  @Get('auth')
  @Redirect(process.env.CLIENT_URL, 301)
  async loginWith42(@Response({ passthrough: true }) res) {
    res.cookie('accessToken', this.authService.getAccessToken(), {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return { msg: 'success' };
  }

  @UseGuards(LoggedInGuard)
  @Get('logout')
  async logout(@Response({ passthrough: true }) res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    res.clearCookie('accessToken', {
      httpOnly: true,
      maxAge: 0,
    });
    return { msg: 'success' };
  }

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
