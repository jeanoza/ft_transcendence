import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
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

  @Post('generate')
  //@UseGuards(JwtAuthGuard) //FIXME: put gaurd after implement on frontend
  async register(@Res() response: Response, @Body('user') user) {
    const { otpauthUrl } = await this.auth2faService.generate2faSecret(user);
    return this.auth2faService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('enable')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async enable2fa(@Body('user') user, @Body('twoFactorCode') twoFactorCode) {
    const isCodeValid = this.auth2faService.validate2faCode(
      twoFactorCode,
      user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.auth2faService.enable2fa(user.id);
  }

  @Post('disable')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async disable2fa(@Body('user') user, @Body('twoFactorCode') twoFactorCode) {
    const isCodeValid = this.auth2faService.validate2faCode(
      twoFactorCode,
      user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.auth2faService.disable2fa(user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() request,
    @Res({ passthrough: true }) response,
    @Body('twoFactorCode') twoFactorCode,
  ) {
    const isValid2faCode = this.auth2faService.validate2faCode(
      twoFactorCode,
      request.user,
    );
    if (!isValid2faCode)
      throw new UnauthorizedException('Wrong authentication code');

    response.cookie(
      'accessToken',
      this.authService.getAccessToken(request.user.id, true),
      { httpOnly: true, maxAge: process.env.JWT_MAX_AGE },
    );
  }
}
