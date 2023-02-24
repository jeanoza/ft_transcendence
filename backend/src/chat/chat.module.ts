import { Module } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channelMember.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelChat } from './entities/channelChat.entity';
import { ChannelService } from './services/channel.service';
import { ChatGateway } from './chat.gateway';
import { DMService } from './services/dm.service';
import { UserService } from 'src/user/services/user.service';
import { Friend } from 'src/user/entities/friend.entity';
import { Blocked } from 'src/user/entities/blocked.entity';
import { DM } from './entities/dm.entity';
import { ChannelController } from './controllers/channel.controller';
import { DMController } from './controllers/dm.controller';
import { BlockedService } from 'src/user/services/blocked.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
  controllers: [ChannelController, DMController],
  providers: [
    DMService,
    ChannelService,
    UserService,
    BlockedService,
    ChatGateway,
  ],
})
export class ChatModule {}
