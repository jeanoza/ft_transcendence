import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  Request,
  Res,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { _2faService } from './_2fa.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Jwt2faGuard } from './guard/jwt-2fa.guard';

@Controller('api/2fa')
export class _2faController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly _2faService: _2faService,
  ) {}
  logger = new Logger('2fa.controller');

  @Get()
  @UseGuards(Jwt2faGuard)
  verifyAuthed(@Req() req) {
    return true;
  }

  @Get('generate')
  @UseGuards(JwtAuthGuard) //FIXME: put gaurd after implement on frontend
  async register(@Req() req, @Res() res) {
    const { otpauthUrl } = await this._2faService.generate2faSecret(req.user);
    return this._2faService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('enable')
  @HttpCode(200)
  @UseGuards(Jwt2faGuard)
  async enable2fa(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body('_2faCode') _2faCode,
  ) {
    const isCodeValid = this._2faService.validate2faCode(_2faCode, req.user);
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this._2faService.enable2fa(req.user.id);
    res.cookie(
      'accessToken',
      this.authService.getAccessToken(req.user.id, true),
      { httpOnly: true, maxAge: process.env.JWT_MAX_AGE },
    );
  }

  @Post('disable')
  @HttpCode(200)
  @UseGuards(Jwt2faGuard)
  async disable2fa(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body('_2faCode') _2faCode,
  ) {
    const isCodeValid = this._2faService.validate2faCode(_2faCode, req.user);
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this._2faService.disable2fa(req.user.id);
    res.cookie('accessToken', this.authService.getAccessToken(req.user.id), {
      httpOnly: true,
      maxAge: process.env.JWT_MAX_AGE,
    });
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body('_2faCode') _2faCode,
  ) {
    const isValid2faCode = this._2faService.validate2faCode(_2faCode, req.user);
    if (!isValid2faCode)
      throw new UnauthorizedException('Wrong authentication code');

    res.cookie(
      'accessToken',
      this.authService.getAccessToken(req.user.id, true),
      { httpOnly: true, maxAge: process.env.JWT_MAX_AGE },
    );
  }
}
