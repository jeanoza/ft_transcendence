import { Controller, UseGuards, Logger, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DMService } from './dm.service';

@Controller('api/dm')
@UseGuards(JwtAuthGuard)
export class DMController {
  constructor(private readonly dmService: DMService) {}
  logger = new Logger('DM.controller');

  @Get()
  async getAllDms(@Req() req) {
    return await this.dmService.getAllDmUsersByCurrentUserId(req.user.id);
  }
}
