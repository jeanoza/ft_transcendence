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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@Request() req) {
    console.log('isAuthenticated()', req.isAuthenticated());
    return req.user || false;
  }

  @UseGuards(NotLoggedInGuard)
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return req.user;
  }

  @UseGuards(LoggedInGuard)
  @Get('logout')
  logout(@Response() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
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
