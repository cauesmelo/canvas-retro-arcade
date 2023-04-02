import { constants } from '../engine/constants';
import heartSpritePNG from '../../img/heart.png';
import syringeSpritePNG from '../../img/syringe.png';

export class Syringe {
  constructor({ gameScreen, inputs, timer, bullets, setGameState }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.bullets = bullets;
    this.setGameState = setGameState;
    this.x = constants.windowWidth / 2;
    this.y = constants.windowHeight - 42;
    this.height = 32;
    this.width = 32;
    this.canShoot = true;
    this.lifes = 3;
    this.syringeSprite = new Image();
    this.syringeSprite.src = syringeSpritePNG;
    this.heartSprite = new Image();
    this.heartSprite.src = heartSpritePNG;
    this.deltaShoot = 0;
  }

  draw() {
    this.gameScreen.ctx.drawImage(this.syringeSprite, this.x, this.y, this.width, this.height);
    for (let i = 0; i < this.lifes; i += 1) {
      this.gameScreen.ctx.drawImage(this.heartSprite, constants.windowWidth - 65 + i * 20, 5, 16, 16);
    }

    this.checkCollision();

    if (!this.canShoot) {
      this.deltaShoot += this.timer.delta;

      if (this.deltaShoot > 50) {
        this.deltaShoot = 0;
        this.canShoot = true;
      }
    }
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= 3 * this.timer.delta;
    }
  }

  moveRight() {
    if (this.x < constants.windowWidth - this.width) {
      this.x += 3 * this.timer.delta;
    }
  }

  checkCollision() {
    this.bullets.instances.forEach((bullet) => {
      if (bullet.isEnemy && bullet.active) {
        if (bullet.x >= this.x + 8 && bullet.x <= this.x + 24) {
          if (bullet.y > this.y + 5) {
            this.hit();
            bullet.active = false;
          }
        }
      }
    });
  }

  shoot() {
    if (this.canShoot) {
      this.bullets.syringeShoot(this.x, this.y);
      this.inputs.spacePressed = false;
      this.canShoot = false;
      this.deltaShoot = 0;
    }
  }

  hit() {
    this.lifes -= 1;
    if (this.lifes === 0) {
      this.setGameState('LOSE');
    }
  }
}
