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

import { from, toArray } from 'rxjs';
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
  userList: Set<string> = new Set();

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
    //console.log(data);
    client.join(data.room);

    this.server.to(data.room).emit('recvMSG', {
      sender: data.room,
      message: `${data.user} has joined.`,
    });
    this.userList.add(data.user);
    this.server.to(data.room).emit('userList', from(this.userList));
  }

  //FIXME: to disconnect on other browser
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, data) {
    //console.log(data.user);
    //console.log(client.rooms);
    client.leave(data.room);
    //console.log(client.rooms);
    this.server.to(data.room).emit('recvMSG', {
      sender: data.room,
      message: `${data.user} left`,
    });

    this.server.to(data.room).emit('userList', this.userList);
  }

  @SubscribeMessage('sendMSG')
  handleMessage(@MessageBody() data: any): void {
    this.server
      .to(data.room)
      .emit('recvMSG', { sender: data.sender, message: data.message });
  }
}
