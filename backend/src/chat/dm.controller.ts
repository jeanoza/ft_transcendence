import { Controller, UseGuards, Logger, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DMService } from './dm.service';

@Controller('api/dm')
@UseGuards(JwtAuthGuard)
export class DMController {
  constructor(private readonly dmService: DMService) {}
  logger = new Logger('DM.controller');

  @Get(':userId')
  async getAllDms(@Param('userId') userId: number) {
    return await this.dmService.getAllDmUsersByCurrentUserId(userId);
  }
}
