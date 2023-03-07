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
import { GAME_STATUS, ROLE } from './room';

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

    console.log(this.online);
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
      client.join(roomName);
      const user = await this.userService.findOne(senderId);

      this.server
        .to(receiverSocket)
        .emit('invitedGame', { inviteUser: user, roomName });
    } else
      client.emit('error', new UnauthorizedException('The user is offline!'));
  }

  @SubscribeMessage('startInterval')
  async startInterval(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    this.logger.debug('START INTERVAL');
    this.server
      .to(roomName)
      .emit('updateObservers', this.gameService.getObserversInRoom(roomName));
    // clearInterval if already exist interval set
    if (intervalIds[roomName]) clearInterval(intervalIds[roomName]);
    intervalIds[roomName] = setInterval(() => {
      const room = this.gameService.rooms.get(roomName);
      if (room) {
        room.update();
        if (room.getStatus() === GAME_STATUS.End) {
          clearInterval(intervalIds[roomName]);
          //this.logger.debug('FIN interval');
          if (room.getWinner() && room.getLoser())
            this.gameService.updateMatchResult(room);
        }
        this.server.to(roomName).emit('roomInfo', room);
      }
    }, 25);
  }

  @SubscribeMessage('onWait')
  async restart(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
  ) {
    const room = this.gameService.rooms.get(roomName);
    room.setStatus(GAME_STATUS.Waiting);
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

      this.server.emit('liveGameList', Array.from(this.gameService.rooms));

      setTimeout(() => {
        if (homeId)
          this.server
            .to(this.online.get(homeId))
            .emit('enterRoom', { role: ROLE.Home, roomName });
        if (awayId)
          this.server
            .to(this.online.get(awayId))
            .emit('enterRoom', { role: ROLE.Away, roomName });
      }, 1000);
    }
  }

  @SubscribeMessage('observeGame')
  async observeGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('observerId') observerId: number,
    @MessageBody('roomName') roomName: string,
  ) {
    if (this.server.adapter['rooms'].get(roomName)) {
      client.join(roomName);

      const room = this.gameService.rooms.get(roomName);
      room.addParticipant(observerId);
      setTimeout(() => {
        this.server
          .to(this.online.get(observerId))
          .emit('enterRoom', { role: ROLE.Observer, roomName });
      }, 1000);
    }
  }

  @SubscribeMessage('refuseGame')
  async refuseGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('refuseUser') refuseUser: User,
    @MessageBody('roomName') roomName: string,
  ) {
    console.log(this.server.adapter['rooms']);
    this.server.to(roomName).emit('refusedGame', { refuseUser, roomName });
  }
  @SubscribeMessage('leaveGame')
  async leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
    @MessageBody('role') role: number,
  ) {
    //this.logger.debug('LEAVE-BEFORE');
    //console.log(this.server.adapter['rooms']);
    const room = this.gameService.rooms.get(roomName);

    client.leave(roomName);

    //this.logger.debug(`AFTER LEAVE: ${role}`);
    //console.log(this.server.adapter['rooms']);

    if (role && (role === ROLE.Home || role === ROLE.Away)) {
      if (role === ROLE.Home) room.setHome(null);
      else if (role === ROLE.Away) room.setAway(null);
      this.server.to(roomName).emit('roomInfo', room);
    }
    if (!this.server.adapter['rooms'].get(roomName)) {
      // FIXME: see side effect for observers....
      //console.log('before', this.gameService.rooms.get(roomName));
      this.gameService.rooms.delete(roomName);
      this.server.emit('liveGameList', Array.from(this.gameService.rooms));
      //console.log('after', this.gameService.rooms.get(roomName));
    }

    this.server
      .to(roomName)
      .emit('updateObservers', this.gameService.getObserversInRoom(roomName));
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

  @SubscribeMessage('getLiveGameList')
  getLiveGameList(@ConnectedSocket() client: Socket) {
    if (this.gameService.rooms.size)
      client.emit('liveGameList', Array.from(this.gameService.rooms));
  }

  @SubscribeMessage('leaveGamePage')
  leaveGamePage(
    @ConnectedSocket() client: Socket,
    @MessageBody('userId') userId: number,
  ) {
    this.gameService.rooms.forEach((room) => {
      const participants = room.getParticipants();

      //Verify current user participe a game
      //if participated, make it leave game
      if (participants.has(userId)) {
        room.deleteParticipant(userId);

        let role = 0;
        if (room.getHome()?.id === userId) role = 1;
        else if (room.getAway()?.id === userId) role = 2;
        client.emit('makeLeaveGame', { role, roomName: room.getRoomName() });
      }
    });
  }

  @SubscribeMessage('joinRandomMatch')
  joinRandomMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomName') roomName: string,
    @MessageBody('role') role: ROLE,
  ) {
    client.join(roomName);
    setTimeout(() => {
      client.emit('enterRoom', { role, roomName });
    }, 1000);
  }

  @SubscribeMessage('addWaiting')
  async addWaiting(
    @ConnectedSocket() client: Socket,
    @MessageBody('userId') userId: number,
  ) {
    this.gameService.addWaiting(userId, client.id);

    this.logger.debug('AFTER ADD WAITING');
    console.log(this.gameService.waitings);

    const otherId = this.gameService.findUser(userId);
    if (otherId) {
      const roomName = `game-${otherId}-${userId}`;
      await this.gameService.createRoom(roomName, otherId, userId);
      this.server
        .to(this.gameService.waitings.get(otherId))
        .emit('foundRandomMatch', { roomName, role: ROLE.Home });
      this.server
        .to(this.gameService.waitings.get(userId))
        .emit('foundRandomMatch', { roomName, role: ROLE.Away });

      this.gameService.deleteWaiting(otherId);
      this.gameService.deleteWaiting(userId);
      this.server.emit('liveGameList', Array.from(this.gameService.rooms));
    }
  }

  @SubscribeMessage('deleteWaiting')
  deleteWaiting(
    @ConnectedSocket() client: Socket,
    @MessageBody('userId') userId: number,
  ) {
    this.gameService.deleteWaiting(userId);
    this.logger.debug('AFTER DELETE WAITING');
    console.log(this.gameService.waitings);
  }
}
