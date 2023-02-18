import { Controller, UseGuards, Logger, Get, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChannelService } from './channel.service';

@Controller('api/channel')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  logger = new Logger('channel.controller');

  @Get()
  async getAllChannel(@Req() req) {
    return await this.channelService.findAllByUserId(req.user.id);
  }

  @Get(':name')
  async getChannelByName(@Param('name') name: string) {
    return await this.channelService.findByName(name);
  }
}
