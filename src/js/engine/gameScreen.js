import { constants } from './constants';

export class GameScreen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = constants.windowWidth;
    this.canvas.height = constants.windowHeight;
    this.ctx.fillStyle = constants.primaryColor;
    this.ctx.font = constants.font;
    this.ctx.textAlign = constants.textAlign;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  write(text, x, y, size) {
    if (size) {
      this.ctx.font = constants.fontWithSize(size);
    }

    this.ctx.fillText(text, x, y);
    this.ctx.font = constants.font;
    this.ctx.textAlign = constants.textAlign;
  }

  writeCenter(text, size) {
    if (size) {
      this.ctx.font = constants.fontWithSize(size);
    }

    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = constants.font;
    this.ctx.textAlign = constants.textAlign;
  }

  writeLeft(text, x, y, size) {
    this.ctx.textAlign = 'left';

    if (size) {
      this.ctx.font = constants.fontWithSize(size);
    }

    this.ctx.fillText(text, x, y);
    this.ctx.font = constants.font;
    this.ctx.textAlign = constants.textAlign;
  }
}
