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
  }

  //FIXME: ConnectedSocket or not?
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} disconnected`);
  }

  @SubscribeMessage('enterChatPage')
  async handleChannelList(client: Socket, userId: number) {
    try {
      client.emit(
        'channels',
        await this.channelService.findAllByUserId(userId),
      );
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }

  /**
   * create or register in channel
   * @param client
   * @param data
   */
  @SubscribeMessage('newChannel')
  async handleRegister(client: Socket, data) {
    this.logger.log('newChannel');
    this.logger.log(data);
    try {
      await this.channelService.register(data);
      client.emit(
        'channels',
        await this.channelService.findAllByUserId(data.userId),
      );
      client.emit('channelRegistered', data.channel.name);
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }

  @SubscribeMessage('joinChannel')
  async handlejoinChannel(client: Socket, data) {
    const { channel } = data;
    client.join(channel);
    client.emit(
      'userList',
      await this.channelService.findAllUserInChannel(channel),
    );
    this.logger.log('joinChannel');
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, data) {
    this.logger.log('leaveChannel');
  }

  @SubscribeMessage('sendMSG')
  handleMessage(@MessageBody() data: any): void {
    this.logger.log('sendMSG');
    this.server.in(data.channel).emit('recvMSG', {
      sender: data.sender,
      message: data.message,
      channel: data.channel,
    });
  }
}
