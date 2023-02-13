import { Module } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channelMember.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelChat } from './entities/channelChat.entity';
import { ChannelService } from './channel.service';
import { ChatGateway } from './chat.gateway';
import { DMService } from './dm.service';
import { UserService } from 'src/user/services/user.service';
import { Friend } from 'src/user/entities/friend.entity';
import { Blocked } from 'src/user/entities/blocked.entity';
import { DM } from './entities/dm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ChannelMember,
      ChannelChat,
      User,
      Friend,
      Blocked,
      DM,
    ]),
  ],
  providers: [DMService, ChannelService, UserService, ChatGateway],
})
export class ChatModule {}
