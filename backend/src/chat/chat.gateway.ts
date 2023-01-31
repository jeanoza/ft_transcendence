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
import { ChannelService } from 'src/chat/channel.service';

@WebSocketGateway({
  namespace: 'ws-chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly channelService: ChannelService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server): any {
    this.logger.log('after init');
  }

  //FIXME: ConnectedSocket or not?
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} connected`);
    this.server.emit(
      'channels',
      await this.channelService.findAllPublicChanList(),
    );
  }

  //FIXME: ConnectedSocket or not?
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} disconnected`);
  }

  @SubscribeMessage('joinChannel')
  async handleJoinRoom(client: Socket, data) {
    this.logger.log('join  channel');
    this.logger.log(data);
    try {
      await this.channelService.join(data);
      //client.join(data.channel.name);
      //console.log(data.channel.name);
      this.server
        .to(data.channel.name)
        .emit('channels', await this.channelService.findAllPublicChanList());
      client.emit('joined');
    } catch (e) {
      console.log(e);
      client.emit('error', e);
    }
  }

  //FIXME: to disconnect on other browser
  @SubscribeMessage('leaveChannel')
  handleLeaveRoom(client: Socket, data) {
    this.logger.log('leaveChannel');
  }

  @SubscribeMessage('sendMSG')
  handleMessage(@MessageBody() data: any): void {
    this.logger.log('sendMSG');
    this.server
      .in(data.channel)
      .emit('recvMSG', { sender: data.sender, message: data.message });
  }
}
