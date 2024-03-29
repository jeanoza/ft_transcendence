import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { _2faService } from '../services/_2fa.service';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from '../services/auth.service';
import { Jwt2faGuard } from '../guard/jwt-2fa.guard';

@Controller('api/2fa')
export class _2faController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly twofactorService: _2faService,
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
    const { otpauthUrl } = await this.twofactorService.generate2faSecret(
      req.user,
    );
    return this.twofactorService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('enable')
  @HttpCode(200)
  @UseGuards(Jwt2faGuard)
  async enable2fa(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body('_2faCode') _2faCode,
  ) {
    const isCodeValid = this.twofactorService.validate2faCode(
      _2faCode,
      req.user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.twofactorService.enable2fa(req.user.id);
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
    const isCodeValid = this.twofactorService.validate2faCode(
      _2faCode,
      req.user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.twofactorService.disable2fa(req.user.id);
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
    const isValid2faCode = this.twofactorService.validate2faCode(
      _2faCode,
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
