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
  namespace: /\ws-.+/,
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  //rooms: Map<string, Set<string>> = new Map();
  rooms = {};

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

  @SubscribeMessage('joinChannel')
  handleJoinRoom(client: Socket, data) {
    const { channel, user } = data;
    client.join(channel);
    if (!this.rooms[channel]) this.rooms[channel] = [];
    if (!this.rooms[channel].find((el) => el === user))
      this.rooms[channel].push(user);
    this.server.to(channel).emit('userList', this.rooms[channel]);
    this.server.to(channel).emit('recvMSG', {
      sender: channel,
      message: `${user} has joined.`,
    });
  }

  //FIXME: to disconnect on other browser
  @SubscribeMessage('leaveChannel')
  handleLeaveRoom(client: Socket, data) {
    const { channel, user } = data;
    client.leave(channel);

    this.rooms[channel] = this.rooms[channel]?.filter((el) => el != user);
    this.server.to(channel).emit('userList', this.rooms[channel]);
    this.server.to(channel).emit('recvMSG', {
      sender: channel,
      message: `${user} left`,
    });
  }

  @SubscribeMessage('sendMSG')
  handleMessage(@MessageBody() data: any): void {
    this.server
      .in(data.channel)
      .emit('recvMSG', { sender: data.sender, message: data.message });
  }
}
