import { User } from '../user/entities/user.entity';

enum ROLE {
  Observer,
  Home,
  Away,
}
enum PADDLE_MOVE {
  Up = 1,
  Down,
}

enum GAME_STATUS {
  Waiting = 1,
  Playing,
  End,
}

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

interface Ready {
  home: boolean;
  away: boolean;
}

interface PaddlePos {
  home: number;
  away: number;
}

const BALL_SIZE = 20;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const SCORE_TO_WIN = 3;

export class Room {
  private home: User;
  private away: User;
  private roomName: string;

  private status: GAME_STATUS;

  private ready: Ready;
  private paddlePos: PaddlePos;

  private ballPos: BallPos;
  private ballDir: BallDir;
  private score: Score;
  private winner: string | null;

  constructor(home: User, away: User, roomName: string) {
    this.home = home;
    this.away = away;
    this.roomName = roomName;
    this.status = GAME_STATUS.Waiting;
    this.init();
  }

  //#region getter

  getReady(): Ready {
    return this.ready;
  }
  getPaddlePos(): PaddlePos {
    return this.paddlePos;
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
  getStatus(): GAME_STATUS {
    return this.status;
  }
  //#endregion

  //#region setter
  setReady(ready: Ready): void {
    this.ready = ready;
  }
  setPaddlePos(paddlePos: PaddlePos): void {
    this.paddlePos = paddlePos;
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
  setStatus(status: GAME_STATUS): void {
    this.status = status;
  }

  setHome(home: User | null): void {
    this.home = home;
  }
  setAway(away: User | null): void {
    this.away = away;
  }
  //#endregion

  paddleUp(posY: number) {
    return Math.max(posY - 20, 0);
  }
  paddleDown(posY: number) {
    return Math.min(posY + 20, GAME_HEIGHT - PADDLE_HEIGHT);
  }

  updatePaddles(role: ROLE, move: PADDLE_MOVE) {
    const posY = role === ROLE.Home ? this.paddlePos.home : this.paddlePos.away;

    if (move === PADDLE_MOVE.Up) {
      this.paddlePos[role === ROLE.Home ? 'home' : 'away'] =
        this.paddleUp(posY);
    } else {
      this.paddlePos[role === ROLE.Home ? 'home' : 'away'] =
        this.paddleDown(posY);
    }
  }

  init() {
    this.ready = { home: false, away: false };
    this.paddlePos = { home: 160, away: 160 };

    this.ballPos = { x: 50, y: 50 };
    this.ballDir = { x: 1, y: 1 };
    this.score = { home: 0, away: 0 };
    this.winner = null;
  }

  update() {
    if (this.ready.home && this.ready.away) {
      this.status = GAME_STATUS.Playing;
      this.init();
    }
    if (this.score.home === SCORE_TO_WIN || this.score.away === SCORE_TO_WIN) {
      this.status = GAME_STATUS.End;
      this.winner =
        this.score.home > this.score.away ? this.home.name : this.away.name;
    }
    //// if wating status or end status, do not move ball
    if (this.status === GAME_STATUS.Waiting || this.status === GAME_STATUS.End)
      return;

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
        nextY >= this.paddlePos.home &&
        nextY <= this.paddlePos.home + PADDLE_HEIGHT) ||
      (nextX > GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        nextY >= this.paddlePos.away &&
        nextY <= this.paddlePos.away + PADDLE_HEIGHT)
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
