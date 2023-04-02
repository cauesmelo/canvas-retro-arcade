import { constants } from '../engine/constants';
import { randomBetween } from '../engine/utils';

export class Snake {
  constructor({ gameScreen, timer, inputs, gridHeight, gridWidth, apple, setGameState, addScore }) {
    this.gameScreen = gameScreen;
    this.timer = timer;
    this.inputs = inputs;
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.apple = apple;
    this.setGameState = setGameState;
    this.addScore = addScore;

    this.headX = 5;
    this.headY = 5;
    this.hasToGrow = false;
    this.body = [
      { x: 5, y: 4 },
      { x: 5, y: 3 },
    ];
    this.dirX = 0;
    this.dirY = 1;
    this.lastDirX = 0;
    this.lastDirY = 1;
    this.timePassed = 0;
    this.speed = 1;
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.headX * 10 + 10, this.headY * 10 + 50, 10, 10);
    this.gameScreen.ctx.fillStyle = constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();

    this.body.forEach((segment) => {
      this.gameScreen.ctx.beginPath();
      this.gameScreen.ctx.rect(segment.x * 10 + 10, segment.y * 10 + 50, 10, 10);
      this.gameScreen.ctx.fillStyle = constants.primaryColor;
      this.gameScreen.ctx.fill();
      this.gameScreen.ctx.closePath();
    });
  }

  update() {
    this.timePassed += this.timer.delta;

    if (this.timePassed > 20 / this.speed) {
      this.move();
      this.timePassed -= 20 / this.speed;
    }
  }

  move() {
    let tempCoord = {
      x: this.headX,
      y: this.headY,
    };

    const newHeadX = this.headX + this.dirX;
    const newHeadY = this.headY + this.dirY;

    if (this.collideWithScreen(newHeadX, newHeadY)) return;

    this.headX = newHeadX;
    this.headY = newHeadY;

    this.lastDirX = this.dirX;
    this.lastDirY = this.dirY;

    this.collideWithApple();
    this.collideWithSelf();

    this.body.forEach((segment) => {
      const tempX = segment.x;
      const tempY = segment.y;

      segment.x = tempCoord.x;
      segment.y = tempCoord.y;

      tempCoord = {
        x: tempX,
        y: tempY,
      };
    });

    if (this.hasToGrow) {
      this.body.push(tempCoord);
      this.hasToGrow = false;
    }
  }

  collideWithScreen(x, y) {
    if (x > this.gridWidth || x < 0 || y < 0 || y > this.gridHeight) {
      this.setGameState('LOSE');
      return true;
    }

    return false;
  }

  collideWithApple() {
    if (this.apple.x === this.headX && this.apple.y === this.headY) {
      this.speed += 0.1;
      this.addScore(10);
      this.apple.x = randomBetween(0, this.gridWidth);
      this.apple.y = randomBetween(0, this.gridHeight);
      this.hasToGrow = true;
    }
  }

  collideWithSelf() {
    this.body.forEach((segment) => {
      if (segment.x === this.headX && segment.y === this.headY) {
        this.setGameState('LOSE');
      }
    });
  }

  validVel(x, y) {
    return x !== this.lastDirX && y !== this.lastDirY;
  }
}
