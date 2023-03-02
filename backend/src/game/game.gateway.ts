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
import { clearInterval } from 'timers';
import { GameService } from './game.service';

const intervalIds = {};

@WebSocketGateway({
  namespace: 'ws-game',
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

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
      const roomName = `game-${senderId}-${receiverId}`;
      //const roomName = `game-${senderId}`;
      client.join(roomName);

      this.server.to(receiverSocket).emit('invitedGame', { roomName });
    } else
      client.emit('error', new UnauthorizedException('The user is offline!'));
  }

  @SubscribeMessage('startInterval')
  async startInterval(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    // clearInterval if already exist interval set
    if (intervalIds[roomName]) clearInterval(intervalIds[roomName]);
    intervalIds[roomName] = setInterval(() => {
      const room = this.gameService.rooms.get(roomName);
      room.update();
      if (room.getStatus() === 3) {
        clearInterval(intervalIds[roomName]);
        // FIXME: ici send match history and renouvel rank point
        this.logger.debug('FIN interval');
      }
      this.server.to(roomName).emit('roomInfo', room);
    }, 25);
  }

  @SubscribeMessage('onWait')
  async restart(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    const room = this.gameService.rooms.get(roomName);
    room.setStatus(1);
    client.emit('roomInfo', room);
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

      const _splitted = roomName.split('-');
      const homeId = Number(_splitted[1]);
      const awayId = Number(_splitted[2]);

      await this.gameService.createRoom(roomName, homeId, awayId);

      setTimeout(() => {
        //console.log('here', homeId, awayId);
        if (homeId)
          this.server
            .to(this.online.get(homeId))
            .emit('enterRoom', 1, roomName);
        if (awayId)
          this.server
            .to(this.online.get(awayId))
            .emit('enterRoom', 2, roomName);
      }, 1000);
    }
  }
  @SubscribeMessage('refuseGame')
  async refuseGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    console.log(this.server.adapter['rooms']);
    this.server.to(roomName).emit('refusedGame', { roomName });
  }
  @SubscribeMessage('leaveGame')
  async leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
    @MessageBody('role') role: number,
  ) {
    //this.logger.debug('LEAVE-BEFORE');
    //console.log(this.server.adapter['rooms']);
    client.leave(roomName);
    //this.logger.debug(`AFTER LEAVE: ${role}`);
    //console.log(this.server.adapter['rooms']);

    if (role && (role === 1 || role === 2)) {
      const room = this.gameService.rooms.get(roomName);
      if (role === 1) room.setHome(null);
      else if (role === 2) room.setAway(null);
      this.server.to(roomName).emit('roomInfo', room);
    }
    if (!this.server.adapter['rooms'].get(roomName)) {
      // FIXME: see side effect for observers....
      //console.log('before', this.gameService.rooms.get(roomName));
      this.gameService.rooms.delete(roomName);
      //console.log('after', this.gameService.rooms.get(roomName));
    }
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
    @MessageBody('ready') ready: any,
    @MessageBody('roomName') roomName: string,
  ) {
    const room = this.gameService.rooms.get(roomName);
    room.setReady(ready);
    this.server.to(roomName).emit('roomInfo', room);
  }

  @SubscribeMessage('updatePaddle')
  updateHomePaddle(
    @ConnectedSocket() client: Socket,
    @MessageBody('role') role: number,
    @MessageBody('roomName') roomName: string,
    @MessageBody('move') move: number,
  ) {
    const room = this.gameService.rooms.get(roomName);
    room.updatePaddles(role, move);
  }
}
