import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class AppController {
  @Get('/images/avatar/:path')
  getAvatar(@Param('path') path: string, @Res() res: Response) {
    const imagePath = '/images/avatar/' + path;
    res.sendFile(imagePath, { root: '.' });
  }
}
