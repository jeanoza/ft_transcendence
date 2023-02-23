import { Module } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway';
import { EventsGateway } from './events.gateway';

//FIXME: use EventsModule ? or use Each gateway like a controller??
@Module({
  imports: [],
  providers: [EventsGateway, ChatGateway],
  exports: [ChatGateway],
})
export class EventsModule {}
