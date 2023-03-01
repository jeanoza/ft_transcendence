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
import { Room } from './room';

const BALL_SIZE = 20;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;

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
  private rooms = new Map<string, Room>();

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
      const roomName = `game-${senderId}-${receiverId}`;
      //const roomName = `game-${senderId}`;
      client.join(roomName);

      console.log(this.rooms);
      this.server.to(receiverSocket).emit('invitedGame', { roomName });
    } else
      client.emit('error', new UnauthorizedException('The user is offline!'));
  }
  @SubscribeMessage('acceptGame')
  async acceptGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    if (this.server.adapter['rooms'].get(roomName)) {
      client.join(roomName);
      this.logger.debug('[Room list]');
      console.log(this.server.adapter['rooms']);
      this.server.to(roomName).emit('acceptedGame', { roomName });

      const [game, senderId, receiverId] = roomName.split('-');
      const home = await this.userService.findOne(Number(senderId));
      const away = await this.userService.findOne(Number(receiverId));
      const room = new Room(home, away, roomName);

      this.rooms.set(roomName, room);

      setTimeout(() => {
        if (home.id)
          this.server.to(this.online.get(home.id)).emit('updateRole', 1);
        if (away.id)
          this.server.to(this.online.get(away.id)).emit('updateRole', 2);
        this.server.to(roomName).emit('roomInfo', this.rooms.get(roomName));
      }, 1000);
    }
  }
  @SubscribeMessage('refuseGame')
  async refuseGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    //const roomOwnerId = Number(roomName.split('-')[1]);
    //const roomOwnerSocket = this.online.get(roomOwnerId);
    //this.server.to(roomOwnerSocket).emit('refusedGame', { roomName });
    console.log(this.server.adapter['rooms']);
    this.server.to(roomName).emit('refusedGame', { roomName });
  }
  @SubscribeMessage('leaveGame')
  async leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    this.logger.debug('LEAVE-BEFORE');
    console.log(this.server.adapter['rooms']);
    client.leave(roomName);
    this.logger.debug('AFTER LEAVE');
    console.log(this.server.adapter['rooms']);
  }

  @SubscribeMessage('leaveGameWithoutName')
  async leaveWithoutName(@ConnectedSocket() client: Socket) {
    // FIXME: normally, a client participate one room but see if another case and side effect commes.
    const iter = client.rooms[Symbol.iterator]();
    for (const room of iter) if (room.includes('game')) client.leave(room);
  }

  @SubscribeMessage('ready')
  async changeReady(
    @ConnectedSocket() client: Socket,
    @MessageBody('role') role: number,
    @MessageBody('ready') ready: boolean,
    @MessageBody('roomName') roomName: string,
  ) {
    // 1: Home, 2: Away
    if (role !== 0) {
      let query = 'homeReady';
      if (role === 2) query = 'awayReady';
      this.server.to(roomName).emit(query, ready);
    }
  }

  @SubscribeMessage('updatePaddle')
  updateHomePaddle(
    @ConnectedSocket() client: Socket,
    @MessageBody('role') role: number,
    @MessageBody('paddlePos') paddlePos: number,
    @MessageBody('roomName') roomName: string,
    @MessageBody('move') move: number,
  ) {
    //console.log(role, paddlePos, roomName);
    const room = this.rooms.get(roomName);
    const _paddlePos =
      move === 1
        ? Math.max(paddlePos - 20, 0)
        : Math.min(paddlePos + 20, GAME_HEIGHT - PADDLE_HEIGHT);

    if (role === 1) room.setHomePaddlePos(_paddlePos);
    else room.setAwayPaddlePos(_paddlePos);
    this.server.to(roomName).emit('roomInfo', room);
  }
}
