import { User } from '../user/entities/user.entity';

interface BallPos {
  x: number;
  y: number;
}
interface BallDir {
  x: number;
  y: number;
}
interface Score {
  home: number;
  away: number;
}

const BALL_SIZE = 20;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;

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
  private score: Score;

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
    this.score = { home: 0, away: 0 };
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
  getScore(): Score {
    return this.score;
  }
  //#endregion

  //#region setter
  setIsHomeReady(isHomeReady: boolean): void {
    this.isHomeReady = isHomeReady;
  }
  setIsAwayReady(isAwayReady: boolean): void {
    this.isAwayReady = isAwayReady;
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
  setScore(score: Score): void {
    this.score = score;
  }
  //#endregion

  update() {
    if (!this.isHomeReady || !this.isAwayReady) return;

    const nextX = this.ballPos.x + this.ballDir.x * 5;
    const nextY = this.ballPos.y + this.ballDir.y * 5;

    // Check for collision with walls
    if (nextX < 0 || nextX > GAME_WIDTH - BALL_SIZE)
      this.ballDir.x = -this.ballDir.x;
    if (nextY < 0 || nextY > GAME_HEIGHT - BALL_SIZE)
      this.ballDir.y = -this.ballDir.y;

    // Check for collision with paddles
    if (
      (nextX < PADDLE_WIDTH &&
        nextY >= this.homePaddlePos &&
        nextY <= this.homePaddlePos + PADDLE_HEIGHT) ||
      (nextX > GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        nextY >= this.awayPaddlePos &&
        nextY <= this.awayPaddlePos + PADDLE_HEIGHT)
    ) {
      this.ballDir.x = -this.ballDir.x;
    }

    // Check for scoring
    if (nextX < 0) {
      this.score.away += 1;
      this.ballPos = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
      this.ballDir = { x: 1, y: 1 };
      return;
    }
    if (nextX > GAME_WIDTH - BALL_SIZE) {
      this.score.home += 1;
      this.ballPos = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
      this.ballDir = { x: -1, y: -1 };
      return;
    }
    this.ballPos = { x: nextX, y: nextY };
  }
}
