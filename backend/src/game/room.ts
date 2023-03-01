import { User } from '../user/entities/user.entity';

interface BallPos {
  x: number;
  y: number;
}
interface BallDir {
  x: number;
  y: number;
}
export class Room {
  private home: User;
  private away: User;
  private roomName: string;

  private isHomeReady: boolean;
  private isAwayReady: boolean;
  private homePaddlePos: number;
  private awayPaddlePos: number;
  private ballPos: BallPos;
  private ballDir: BallDir;

  constructor(home: User, away: User, roomName: string) {
    this.home = home;
    this.away = away;
    this.roomName = roomName;

    this.isHomeReady = false;
    this.isAwayReady = false;
    this.homePaddlePos = 160;
    this.awayPaddlePos = 160;

    this.ballPos = { x: 50, y: 50 };
    this.ballDir = { x: 1, y: 1 };
  }

  //#region getter
  getIsHomeReady(): boolean {
    return this.isHomeReady;
  }
  getIsAwayReady(): boolean {
    return this.isAwayReady;
  }
  getHomePaddlePos(): number {
    return this.homePaddlePos;
  }
  getAwayPaddlePos(): number {
    return this.awayPaddlePos;
  }
  getBallPos(): BallPos {
    return this.ballPos;
  }
  getBallDir(): BallDir {
    return this.ballDir;
  }
  //#endregion

  //#region setter
  setIsHomeReady(isHomeReady: boolean): void {
    this.isHomeReady = isHomeReady;
  }
  setIsAwayReady(isAwayReady: boolean): void {
    this.isHomeReady = isAwayReady;
  }
  setHomePaddlePos(homePaddlePos: number): void {
    this.homePaddlePos = homePaddlePos;
  }
  setAwayPaddlePos(awayPaddlePos: number): void {
    this.awayPaddlePos = awayPaddlePos;
  }
  setBallPos(ballPos: BallPos): void {
    this.ballPos = ballPos;
  }
  setBallDir(ballDir: BallDir): void {
    this.ballDir = ballDir;
  }
  //#endregion
}
