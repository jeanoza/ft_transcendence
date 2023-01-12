import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    console.log(data);
    //newAccount ? create(join)
    //1. verify email
    //1.1 already ? => throw error
    //1.2 no-register => create => user | name:string

    //login? signin
    //1. verify email && password(hashed)
    //1.1. no email? => throw error
    //1.2 no password => throw error
    //else => user | name:string
    return this.userService.create(data);
  }

  @Post('login')
  login(@Body() data: LoginUserDto) {
    console.log(data);
    return this.userService.login(data);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

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
