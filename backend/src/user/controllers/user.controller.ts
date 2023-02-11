import {
  Controller,
  Get,
  UseGuards,
  Req,
  Logger,
  Param,
  Post,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async getCurrentUser(@Req() req) {
    return req.user;
  }
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images/avatar',
        filename: (req: any, file: any, cb: CallableFunction) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const filename = req.user['name']?.replace(/\s/g, '_');
          const ext = file.originalname.split('.').pop();
          return cb(null, randomName + '_' + filename + '.' + ext);
        },
      }),
    }),
  )
  async uploadAvatar(@Req() req, @UploadedFile() image) {
    const url = process.env.SERVER_URL + '/' + image.path;
    await this.userService.update(req.user.id, { imageURL: url });
    return 'Your avatar photo is updated';
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
