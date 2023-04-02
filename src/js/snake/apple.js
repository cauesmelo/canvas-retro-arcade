import { constants } from '../engine/constants';
import { randomBetween } from '../engine/utils';

export class Apple {
  constructor({ gameScreen, gridHeight, gridWidth }) {
    this.gameScreen = gameScreen;
    this.x = randomBetween(0, gridWidth);
    this.y = randomBetween(0, gridHeight);
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.x * 10 + 10, this.y * 10 + 50, 10, 10);
    this.gameScreen.ctx.fillStyle = constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();
  }
}
