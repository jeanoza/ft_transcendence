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
import { User } from 'src/user/entities/user.entity';

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
        'getAllChannelChat',
        await this.channelService.findAllChannelChat(channelName),
      );
      this.logger.log('joinChannel');
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, { channelName }) {
    client.leave(channelName);
    this.logger.log('leaveChannel');
  }

  @SubscribeMessage('channelChat')
  async handleMessage(
    client: Socket,
    @MessageBody('user') user: User,
    @MessageBody('content') content: string,
    @MessageBody('channel') channel: string | null,
  ): Promise<void> {
    try {
      await this.channelService.saveChannelChat({
        userName: user.name,
        content: content,
        channelName: channel,
      });
      this.server.in(channel).emit('recvMSG', {
        sender: user,
        content: content,
        chatName: channel,
      });
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }
  //#endregion

  //#region DM
  @SubscribeMessage('dm')
  async handleDM(
    client: Socket,
    @MessageBody('sender') sender: User,
    @MessageBody('receiverName') receiverName: string,
    @MessageBody('content') content: string,
  ) {
    try {
      const receiver = await this.userService.findByName(receiverName);
      await this.dmService.createDM(sender.id, receiver.id, content);
      this.server.to(sender.chatSocket)?.emit('recvMSG', {
        sender,
        content,
        chatName: receiver.name,
      });
      this.server.to(receiver.chatSocket)?.emit('recvMSG', {
        sender,
        content,
        chatName: sender.name,
      });
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('joinDM')
  async handlejoinDM(client: Socket, { user, otherName }) {
    try {
      const other = await this.userService.findByName(otherName);
      client.emit(
        'getAllDM',
        await this.dmService.getAllBetweenUser(user.id, other.id),
      );
      this.logger.log('joinDM');
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }
}
