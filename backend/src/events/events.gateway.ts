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
import { from, map, Observable } from 'rxjs';
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

  private logger: Logger = new Logger('EventGateway');

  afterInit(server: Server): any {
    this.logger.log('after init');
  }
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} connected`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} disconnected`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data) {
    client.join(data.room);
    this.server.to(data.room).emit('receiveMessage', {
      sender: data.room,
      message: `${data.user} has joined.`,
    });
  }

  //FIXME: to disconnect on other browser
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, data) {
    console.log(data.user);
    client.leave(data.room);
    this.server.to(data.room).emit('receiveMessage', {
      sender: data.room,
      message: `${data.user} left`,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any): void {
    this.server
      .to(data.room)
      .emit('receiveMessage', { sender: data.sender, message: data.message });
  }
}
