import { Controller, UseGuards, Logger, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChannelService } from './channel.service';

@Controller('api/channel')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  logger = new Logger('channel.controller');

  @Get(':userId')
  async getAllChannel(@Param('userId') userId: number) {
    this.logger.debug(userId);
    return this.channelService.findAllByUserId(userId);
  }
}
