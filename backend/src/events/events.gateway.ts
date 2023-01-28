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

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data) {
    const { room, user } = data;
    client.join(room);
    if (!this.rooms[room]) this.rooms[room] = [];
    if (!this.rooms[room].find((el) => el === user))
      this.rooms[room].push(user);
    this.server.to(room).emit('userList', this.rooms[room]);
    this.server.to(room).emit('recvMSG', {
      sender: room,
      message: `${user} has joined.`,
    });
  }

  //FIXME: to disconnect on other browser
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, data) {
    const { room, user } = data;
    client.leave(room);

    this.rooms[room] = this.rooms[room]?.filter((el) => el != user);
    this.server.to(room).emit('userList', this.rooms[room]);
    this.server.to(room).emit('recvMSG', {
      sender: room,
      message: `${user} left`,
    });
  }

  @SubscribeMessage('sendMSG')
  handleMessage(@MessageBody() data: any): void {
    this.server
      .in(data.room)
      .emit('recvMSG', { sender: data.sender, message: data.message });
  }
}
