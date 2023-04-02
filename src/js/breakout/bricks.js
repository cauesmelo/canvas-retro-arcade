import { constants } from '../engine/constants';

export class Bricks {
  constructor({ gameScreen, inputs }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.rows = 3;
    this.columns = 5;
    this.width = 70;
    this.height = 20;
    this.bricks = [];
    this.brickCount = 15;

    for (let c = 0; c < this.columns; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        this.bricks[c][r] = { x: 0, y: 0 };
      }
    }
  }

  draw() {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        if (!this.bricks[c][r].destroyed) {
          const brickX = c * (this.width + 10) + 45;
          const brickY = r * (this.height + 10) + 40;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.gameScreen.ctx.beginPath();
          this.gameScreen.ctx.rect(brickX, brickY, this.width, this.height);
          this.gameScreen.ctx.fillStyle = constants.primaryColor;
          this.gameScreen.ctx.fill();
          this.gameScreen.ctx.closePath();
        }
      }
    }
  }
}
