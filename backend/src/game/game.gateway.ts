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
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');
  private online = new Map();

  afterInit(server: Server): any {
    this.logger.debug('after init');
  }

  //#region Connection
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Game socket id:${client.id} connected`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.online.forEach((socket, userId) => {
      if (socket === client.id) this.online.delete(userId);
    });
    this.logger.log(`Game socket id:${client.id} disconnected`);
  }

  @SubscribeMessage('connectUser')
  async handleConnectUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ) {
    //this.online.set(client.id, userId);
    this.online.set(userId, client.id);
    this.logger.debug(Array.from(this.online));
  }
  @SubscribeMessage('inviteGame')
  async inviteGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('senderId') senderId: number,
    @MessageBody('receiverId') receiverId: number,
  ) {
    const name = `game-${senderId}-${receiverId}`;
    client.join(name);
    this.server.to(this.online.get(receiverId)).emit('invitedGame', { name });
  }
  @SubscribeMessage('acceptGame')
  async acceptGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    client.join(name);
    console.log(this.server.adapter['rooms'].get(name));
    this.server.to(name).emit('acceptedGame');
  }
  @SubscribeMessage('refuseGame')
  async refuseGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    this.server.to(name).emit('refusedGame', { name });
  }
  @SubscribeMessage('leaveGame')
  async leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    //this.logger.debug('BEFORE');
    //console.log(this.server.adapter['rooms']);
    client.leave(name);
    //this.logger.debug('AFTER LEAVE');
    //console.log(this.server.adapter['rooms']);
  }
}
