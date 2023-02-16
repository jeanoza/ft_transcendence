import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('')
export class AppController {
  @Get('/images/avatar/:path')
  async getAvatar(@Param('path') path: string, @Res() res: Response) {
    const imagePath = 'images/avatar/' + path;

    if (fs.existsSync(imagePath)) res.sendFile(imagePath, { root: '.' });
    else res.sendFile('images/no_image.png', { root: '.' });
  }
}
