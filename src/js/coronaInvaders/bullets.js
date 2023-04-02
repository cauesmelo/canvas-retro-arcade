import { constants } from '../engine/constants';

export class Bullets {
  constructor({ gameScreen, timer }) {
    this.gameScreen = gameScreen;
    this.timer = timer;
    this.instances = [];
    this.bulletVel = 3;
    this.bulletWidth = 2;
    this.bulletHeight = 10;
  }

  draw() {
    this.instances.forEach((bullet) => {
      this.gameScreen.ctx.beginPath();
      this.gameScreen.ctx.rect(bullet.x, bullet.y, this.bulletWidth, this.bulletHeight);
      this.gameScreen.ctx.fillStyle = constants.primaryColor;
      this.gameScreen.ctx.fill();
      this.gameScreen.ctx.closePath();
    });
  }

  move() {
    this.instances.forEach((bullet) => {
      if (bullet.isEnemy) {
        bullet.y += this.bulletVel * this.timer.delta;
      } else {
        bullet.y -= this.bulletVel * this.timer.delta;
      }
    });

    this.checkOutOfBounds();
    this.removeInactives();
  }

  coronaShoot(x, y) {
    this.instances.push({
      x,
      y,
      isEnemy: true,
      active: true,
    });
  }

  syringeShoot(x, y) {
    this.instances.push({
      x: x + 16,
      y: y - 10,
      isEnemy: false,
      active: true,
    });
  }

  checkOutOfBounds() {
    this.instances.forEach((b) => {
      if (b.y < -10 || b.y > constants.windowHeight) {
        b.active = false;
      }
    });
  }

  removeInactives() {
    this.instances = this.instances.filter((b) => b.active);
  }
}
