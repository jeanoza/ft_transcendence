import {
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
import { BlockedService } from 'src/user/services/blocked.service';
import { Channel } from './entities/channel.entity';

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
    private readonly blockedService: BlockedService,
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
  async handleConnectUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ) {
    try {
      await this.userService.update(userId, {
        status: 1,
        chatSocket: client.id,
      });
      client.emit('connected');
    } catch (e) {
      this.logger.debug(e);
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
  async handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: Channel; userId: number },
  ) {
    this.logger.log('newChannel');
    try {
      await this.channelService.register(data);
      client.emit(
        'channels',
        await this.channelService.findAllByUserId(data.userId),
      );
      client.emit('channelRegistered', data.channel.name);
    } catch (e) {
      this.logger.debug(e);
      client.emit('error', e);
    }
  }

  @SubscribeMessage('joinChannel')
  async handlejoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody('channelName') channelName: string,
  ) {
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
      this.logger.debug(`[joinChannel]: ${client.id} join ${channelName}`);
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody('channelName') channelName: string,
  ) {
    client.leave(channelName);
    this.logger.debug(`[leaveChannel]: ${client.id} leaves ${channelName}`);
  }

  @SubscribeMessage('channelChat')
  async handleMessage(
    @ConnectedSocket() client: Socket,
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
  //FIXME: why no client object??
  @SubscribeMessage('dm')
  async handleDM(
    @ConnectedSocket() client: Socket,
    @MessageBody('sender') sender: User,
    @MessageBody('receiverName') receiverName: string,
    @MessageBody('content') content: string,
  ) {
    try {
      const receiver = await this.userService.findByName(receiverName);
      const blockeds = await this.blockedService.getAllBlocked(receiver.id);
      if (!blockeds.find((el) => el.id === sender.id)) {
        await this.dmService.createDM(sender.id, receiver.id, content);
        client.emit('recvMSG', {
          sender,
          content,
          chatName: receiver.name,
        });
        this.server.to(receiver.chatSocket)?.emit('recvMSG', {
          sender,
          content,
          chatName: sender.name,
        });
      } else throw new ForbiddenException(`You are blocked ${receiverName}`);
    } catch (e) {
      this.logger.log(e);
      this.server.to(sender.chatSocket)?.emit('error', e);
    }
  }

  @SubscribeMessage('joinDM')
  async handleJoinDM(
    @ConnectedSocket() client: Socket,
    @MessageBody('user') user: User,
    @MessageBody('otherName') otherName: string,
  ) {
    try {
      const other = await this.userService.findByName(otherName);
      client.emit(
        'getAllDM',
        await this.dmService.getAllBetweenUser(user.id, other.id),
      );
      this.logger.debug(`[joinDM]: ${client.id} join ${otherName}`);
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
  }

  @SubscribeMessage('deleteDM')
  async handleDeleteDM(
    @ConnectedSocket() client: Socket,
    @MessageBody('userId') userId: number,
    @MessageBody('otherId') otherId: number,
  ) {
    try {
      this.dmService.deleteAllBetweenUser(userId, otherId);
    } catch (e) {
      this.logger.log(e);
      client.emit('error', e);
    }
    this.logger.debug(`[deleteDM]: ${client.id} delete ${otherId}`);
  }
}
