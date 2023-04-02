import { constants } from '../engine/constants';

export class Paddle {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.x = constants.windowWidth / 2;
    this.y = constants.windowHeight - 10;
    this.height = 10;
    this.width = 70;
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.x, this.y, this.width, this.height);
    this.gameScreen.ctx.fillStyle = constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();
  }

  moveLeft() {
    if (this.x > 0) this.x -= 5 * this.timer.delta;
  }

  moveRight() {
    if (this.x < constants.windowWidth - this.width) this.x += 5 * this.timer.delta;
  }
}
