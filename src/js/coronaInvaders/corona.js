import coronaSpritePNG from '../../img/corona.png';
import { randomBetween } from '../utils';

export class Corona {
  constructor({ gameScreen, timer, bullets, setGameState, addScore }) {
    this.gameScreen = gameScreen;
    this.timer = timer;
    this.bullets = bullets;
    this.setGameState = setGameState;
    this.addScore = addScore;
    this.rows = 4;
    this.columns = 15;
    this.coronas = [];
    this.coronaCount = 4 * 15;
    this.width = 16;
    this.height = 16;
    this.offsetX = 50;
    this.velocityX = 0.2;
    this.offsetY = 30;
    this.coronaSprite = new Image();
    this.coronaSprite.src = coronaSpritePNG;
    this.deltaShoot = 0;

    for (let c = 0; c < this.columns; c += 1) {
      this.coronas[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        this.coronas[c][r] = { x: 0, y: 0 };
      }
    }
  }

  draw() {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        if (!this.coronas[c][r].destroyed) {
          const coronaX = c * (this.width + 10) + this.offsetX;
          const coronaY = r * (this.height + 10) + this.offsetY;
          this.coronas[c][r].x = coronaX;
          this.coronas[c][r].y = coronaY;
          this.gameScreen.ctx.drawImage(this.coronaSprite, coronaX, coronaY, this.width, this.height);
        }
      }
    }
  }

  move() {
    this.offsetX += this.velocityX;
    if (this.offsetX < 0) this.velocityX *= -1;
    if (this.offsetX > 100) this.velocityX *= -1;
    if (this.coronas.length === 0) {
      this.setGameState('WIN');
    }

    this.deltaShoot += this.timer.delta;
    if (this.deltaShoot > 3 * this.coronaCount) {
      this.shoot();
      this.deltaShoot = 0;
    }

    this.checkCollision();
  }

  shoot() {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        if (!this.coronas[c][r].destroyed) {
          const coronaX = c * (this.width + 10) + this.offsetX;
          const coronaY = r * (this.height + 10) + this.offsetY;
          this.coronas[c][r].x = coronaX;
          this.coronas[c][r].y = coronaY;

          if (randomBetween(1, 100) > 95) {
            this.bullets.coronaShoot(coronaX + 8, coronaY);
          }
        }
      }
    }
  }

  checkCollision() {
    this.bullets.instances.forEach((bullet) => {
      if (bullet.active && !bullet.isEnemy) {
        for (let c = 0; c < this.columns; c += 1) {
          for (let r = 0; r < this.rows; r += 1) {
            if (
              !this.coronas[c][r].destroyed &&
              bullet.x >= this.coronas[c][r].x &&
              bullet.x <= this.coronas[c][r].x + 16 &&
              bullet.y <= this.coronas[c][r].y + 16 &&
              bullet.y <= this.coronas[c][r].y
            ) {
              this.coronas[c][r].destroyed = true;
              this.addScore(10);
              bullet.active = false;
              this.coronaCount -= 1;

              if (this.coronaCount === 0) {
                this.setGameState('WIN');
              }
            }
          }
        }
      }
    });
  }
}
