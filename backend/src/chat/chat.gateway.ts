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

  //#region Connection
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Chat socket id:${client.id} connected`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.userService.handleDisconnectSocket(client.id);
    //this.server.emit('quit', { disconnected: client.id });
    this.logger.log(`Chat socket id:${client.id} disconnected`);
  }

  @SubscribeMessage('connectUser')
  async handleConnectUser(client: Socket, userId: number) {
    try {
      await this.userService.update(userId, {
        status: 1,
        chatSocket: client.id,
      });
      client.emit('connected');
    } catch (e) {
      console.log(e);
      client.emit('error', e);
    }
  }

  //#endregion

  //#region Channel
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
      this.server
        .to(channelName)
        .emit(
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
  async handleMessage(
    client: Socket,
    @MessageBody('user') user: any,
    @MessageBody('content') content: string,
    @MessageBody('channel') channel: string,
  ): Promise<void> {
    this.logger.log('sendMSG', user);
    this.logger.log('sendMSG', content);
    this.logger.log('sendMSG', channel);
    try {
      await this.channelService.saveChannelChat({
        userName: user.name,
        content: content,
        channelName: channel,
      });
      this.server.to(channel).emit('recvMSG', {
        sender: user,
        content: content,
      });
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }
  //#endregion
}
