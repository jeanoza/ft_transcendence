import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  //namespace: /\ws-.+/,
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventGateway');

  afterInit(server: Server): any {
    this.logger.log('after init');
  }

  //FIXME: ConnectedSocket or not?
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} connected`);
  }

  //FIXME: ConnectedSocket or not?
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} disconnected`);
  }
}
