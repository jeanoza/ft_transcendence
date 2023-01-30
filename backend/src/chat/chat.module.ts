import { Module } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channelMember.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelChat } from './entities/channelChat.entity';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMember, ChannelChat, User]),
  ],
  providers: [ChannelService],
})
export class ChatModule {}
