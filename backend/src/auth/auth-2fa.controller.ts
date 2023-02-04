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
import { Auth2faService } from './auth-2fa.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('api/2fa')
export class Auth2faController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly auth2faService: Auth2faService,
  ) {}
  logger = new Logger('2fa.controller');

  @Get('generate')
  @UseGuards(JwtAuthGuard) //FIXME: put gaurd after implement on frontend
  async register(@Req() req, @Res() res) {
    const { otpauthUrl } = await this.auth2faService.generate2faSecret(
      req.user,
    );
    return this.auth2faService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('enable')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async enable2fa(@Req() req, @Body('twoFactorCode') twoFactorCode) {
    //console.log('2fa.controller', req.user);
    this.logger.log(req.user.id);
    const isCodeValid = this.auth2faService.validate2faCode(
      twoFactorCode,
      req.user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.auth2faService.enable2fa(req.user.id);
  }

  @Post('disable')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async disable2fa(@Req() req, @Body('twoFactorCode') twoFactorCode) {
    const isCodeValid = this.auth2faService.validate2faCode(
      twoFactorCode,
      req.user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.auth2faService.disable2fa(req.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body('twoFactorCode') twoFactorCode,
  ) {
    const isValid2faCode = this.auth2faService.validate2faCode(
      twoFactorCode,
      req.user,
    );
    if (!isValid2faCode)
      throw new UnauthorizedException('Wrong authentication code');

    res.cookie(
      'accessToken',
      this.authService.getAccessToken(req.user.id, true),
      { httpOnly: true, maxAge: process.env.JWT_MAX_AGE },
    );
  }
}
