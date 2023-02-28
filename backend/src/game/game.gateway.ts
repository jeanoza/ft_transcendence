import { Logger, UnauthorizedException } from '@nestjs/common';
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
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

@WebSocketGateway({
  namespace: 'ws-game',
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');
  private online = new Map();

  afterInit(server: Server): any {
    this.logger.debug('after init');
  }

  //#region Connection
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Game socket id:${client.id} connected`);
    this.logger.debug('[Room list]');
    console.log(this.server.adapter['rooms']);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.online.forEach((socket, userId) => {
      if (socket === client.id) this.online.delete(userId);
    });
    this.logger.log(`Game socket id:${client.id} disconnected`);
  }

  @SubscribeMessage('connectUser')
  async handleConnectUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ) {
    this.online.set(userId, client.id);
    this.logger.debug('online users');
    console.log(Array.from(this.online));
  }
  @SubscribeMessage('inviteGame')
  async inviteGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('senderId') senderId: number,
    @MessageBody('receiverId') receiverId: number,
  ) {
    const receiverSocket = this.online.get(receiverId);
    if (receiverSocket) {
      const name = `game-${senderId}-${receiverId}`;
      client.join(name);
      this.server.to(receiverSocket).emit('invitedGame', { name });
    } else
      client.emit('error', new UnauthorizedException('The user is offline!'));
  }
  @SubscribeMessage('acceptGame')
  async acceptGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    if (this.server.adapter['rooms'].get(name)) {
      client.join(name);
      this.logger.debug('[Room list]');
      console.log(this.server.adapter['rooms']);
      this.server.to(name).emit('acceptedGame', { name });
      setTimeout(() => {
        //const [nsp, homeId, awayId] = name.split('-');
        this.server.to(name).emit('roomInfo', name);
      }, 1000);
    }
  }
  @SubscribeMessage('refuseGame')
  async refuseGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    //const roomOwnerId = Number(name.split('-')[1]);
    //const roomOwnerSocket = this.online.get(roomOwnerId);
    //this.server.to(roomOwnerSocket).emit('refusedGame', { name });
    console.log(this.server.adapter['rooms']);
    this.server.to(name).emit('refusedGame', { name });
  }
  @SubscribeMessage('leaveGame')
  async leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    this.logger.debug('LEAVE-BEFORE');
    console.log(this.server.adapter['rooms']);
    client.leave(name);
    this.logger.debug('AFTER LEAVE');
    console.log(this.server.adapter['rooms']);
  }

  @SubscribeMessage('leaveGameWithoutName')
  async leaveWithoutName(@ConnectedSocket() client: Socket) {
    //this.logger.debug('BEFORE');
    //console.log(this.server.adapter['rooms']);

    // FIXME: normally, a client participate one room but see if another case and side effect commes.
    const iter = client.rooms[Symbol.iterator]();
    for (const room of iter) if (room.includes('game')) client.leave(room);
  }

  @SubscribeMessage('ready')
  async changeReady(
    @ConnectedSocket() client: Socket,
    @MessageBody('role') role: number,
    @MessageBody('ready') ready: boolean,
    @MessageBody('name') name: string,
  ) {
    // 1: Home, 2: Away
    if (role !== 0) {
      let query = 'homeReady';
      if (role === 2) query = 'awayReady';
      this.server.to(name).emit(query, ready);
    }
  }

  @SubscribeMessage('updatePaddle')
  updateHomePaddle(
    @ConnectedSocket() client: Socket,
    @MessageBody('role') role: number,
    @MessageBody('paddlePos') paddlePos: number,
    @MessageBody('roomName') roomName: string,
  ) {
    //console.log(role, paddlePos, roomName);
    this.server.to(roomName).emit('updatedPaddle', { role, paddlePos });
  }
}
