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
import { UserService } from 'src/user/services/user.service';
import { DMService } from './dm.service';

@WebSocketGateway({
  namespace: 'ws-chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly channelService: ChannelService,
    private readonly dmService: DMService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;
  //connected = new Set();

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server): any {
    this.logger.log('after init');
  }

  //FIXME: ConnectedSocket or not?
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} connected`);
    this.server.emit('come', client.id);
  }

  //FIXME: ConnectedSocket or not?
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.userService.handleDisconnectSocket(client.id);
    this.server.emit('quit', { disconnected: client.id });
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
  async handlejoinChannel(client: Socket, { channelName }) {
    try {
      client.join(channelName);
      client.emit(
        'userList',
        await this.channelService.findAllUserInChannel(channelName),
      );
      client.emit(
        'getChannelChats',
        await this.channelService.findAllChannelChat(channelName),
      );
      this.logger.log('joinChannel');
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, data) {
    this.logger.log('leaveChannel');
  }

  @SubscribeMessage('sendMSG')
  async handleMessage(client: Socket, @MessageBody() data: any): Promise<void> {
    this.logger.log('sendMSG', data);
    try {
      await this.channelService.saveChannelChat({
        userName: data.sender,
        content: data.message,
        channelName: data.channel,
      });
      this.server.in(data.channel).emit('recvMSG', {
        sender: data.sender,
        message: data.message,
        //channel: data.channel,
      });
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }
}
