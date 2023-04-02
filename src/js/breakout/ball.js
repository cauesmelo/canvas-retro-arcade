import { constants } from '../constants';
import { randomBoolean } from '../utils';

export class Ball {
  constructor({ gameScreen, inputs, timer, paddle, bricks, setGameState, addScore }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.paddle = paddle;
    this.bricks = bricks;
    this.setGameState = setGameState;
    this.addScore = addScore;
    this.x = 0;
    this.y = 0;
    this.height = 10;
    this.width = 10;
    this.velX = 0;
    this.velY = 0;
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.x, this.y, this.width, this.height);
    this.gameScreen.ctx.fillStyle = constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();
  }

  checkCollisionWithPaddle() {
    if (this.x >= this.paddle.x && this.x <= this.paddle.x + this.paddle.width) {
      if (this.y >= this.paddle.y - this.height) {
        this.velY *= -1;
        this.increaseVelocity();
      }
    }
  }

  checkCollisionWithBricks() {
    for (let c = 0; c < this.bricks.columns; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const b = this.bricks.bricks[c][r];
        if (!b.destroyed) {
          if (this.x > b.x && this.x < b.x + this.bricks.width && this.y > b.y && this.y < b.y + this.bricks.height) {
            this.velY *= -1;
            b.destroyed = true;
            this.addScore(10);
            this.bricks.brickCount -= 1;

            if (this.bricks.brickCount === 0) {
              this.setGameState('WIN');
            }
          }
        }
      }
    }
  }

  move() {
    this.x += this.velX * this.timer.delta;
    this.y += this.velY * this.timer.delta;

    this.checkCollisionWithBricks();
    this.checkCollisionWithPaddle();

    if (this.x <= 0) {
      this.velX *= -1;
    }

    if (this.x >= constants.windowWidth - this.width) {
      this.velX *= -1;
    }

    if (this.y <= 0) {
      this.velY *= -1;
    }

    if (this.y > constants.windowHeight - this.height) {
      this.setGameState('LOSE');
    }
  }

  increaseVelocity() {
    this.velX += this.velX > 0 ? 0.1 : -0.1;
    this.velY += this.velY > 0 ? 0.1 : -0.1;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  launch() {
    this.velY = -1;

    this.velX = (() => {
      if (this.inputs.rightPressed) {
        return Math.random() * (1 - 0.7) + 0.7;
      }

      if (this.inputs.leftPressed) {
        return Math.random() * (1 - 0.7) + 0.7 * -1;
      }

      if (randomBoolean()) {
        return Math.random() * (1 - 0.7) + 0.7 * -1;
      }
      return Math.random() * (1 - 0.7) + 0.7;
    })();
  }
}
