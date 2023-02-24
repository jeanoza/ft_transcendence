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
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/services/user.service';

@WebSocketGateway({
  namespace: 'ws-game',
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');

  afterInit(server: Server): any {
    this.logger.log('after init');
  }

  //#region Connection
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Game socket id:${client.id} connected`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.userService.handleDisconnectSocket(client.id);
    this.logger.log(`Game socket id:${client.id} disconnected`);
  }
}
