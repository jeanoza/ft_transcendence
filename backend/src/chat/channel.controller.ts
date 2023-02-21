import {
  Controller,
  UseGuards,
  Logger,
  Get,
  Req,
  Param,
  Query,
  Patch,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChannelService } from './channel.service';

@Controller('api/channel')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  logger = new Logger('channel.controller');

  /**
   * Dynamic controller by its query
   * if id => getChannelById
   * if name => getChannelByName
   * else => getAllChannelByUserId
   * @param req
   * @param id
   * @param name
   * @returns
   */
  @Get()
  async getChannel(
    @Req() req,
    @Query('id') id: number,
    @Query('name') name: string,
  ) {
    if (!Number.isNaN(id)) return await this.channelService.findOne(id);
    if (name !== undefined) return await this.channelService.findByName(name);
    return await this.channelService.findAllByUserId(req.user.id);
  }

  @Patch()
  async updateChannel(
    @Req() req,
    @Body('id') id: number,
    @Body('password') password: string,
  ) {
    const channel = await this.channelService.findOne(id);
    if (!channel || channel.ownerId !== req.user.id)
      throw new UnauthorizedException(
        'No channel or you are not channel owner!',
      );
    return await this.channelService.update(id, { password });
  }

  @Get(':name/user')
  async getAllUsers(@Param('name') name: string) {
    return await this.channelService.findAllUserInChannel(name);
  }
  @Get(':name/is_admin')
  async isAdmin(@Param('name') name: string, @Req() req) {
    return await this.channelService.isAdmin(req.user.id, name);
  }

  @Get(':name/is_owner')
  async isOwner(@Param('name') name: string, @Req() req) {
    return await this.channelService.isOwner(req.user.id, name);
  }
  @Get(':name/is_banned')
  async isBanned(@Param('name') name: string, @Req() req) {
    return await this.channelService.isBanned(req.user.id, name);
  }
}
