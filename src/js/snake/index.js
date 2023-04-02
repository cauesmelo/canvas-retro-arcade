import { constants } from '../engine/constants';
import { Apple } from './apple';
import { Snake } from './snake';

const gridWidth = 45;
const gridHeight = 25;

export class SnakeGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;

    this.apple = new Apple({ gameScreen, gridHeight, gridWidth });
    this.snake = new Snake({
      gameScreen,
      timer,
      inputs,
      gridHeight,
      gridWidth,
      apple: this.apple,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });
    this.score = 0;
    this.gameState = 'WAIT';
  }

  setGameState(newState) {
    this.gameState = newState;
  }

  addScore(value) {
    this.score += value;
  }

  restart() {
    this.apple = new Apple({ gameScreen: this.gameScreen, gridHeight, gridWidth });
    this.snake = new Snake({
      gameScreen: this.gameScreen,
      timer: this.timer,
      inputs: this.inputs,
      gridHeight,
      gridWidth,
      apple: this.apple,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });
    this.score = 0;
    this.gameState = 'WAIT';
  }

  handleInputs() {
    if (this.inputs.leftPressed && this.snake.validVel(-1, 0)) {
      this.snake.dirX = -1;
      this.snake.dirY = 0;
    }

    if (this.inputs.upPressed && this.snake.validVel(0, -1)) {
      this.snake.dirX = 0;
      this.snake.dirY = -1;
    }

    if (this.inputs.rightPressed && this.snake.validVel(1, 0)) {
      this.snake.dirX = 1;
      this.snake.dirY = 0;
    }

    if (this.inputs.downPressed && this.snake.validVel(0, 1)) {
      this.snake.dirX = 0;
      this.snake.dirY = 1;
    }
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(10, 50, constants.windowWidth - 20, constants.windowHeight - 60);
    this.gameScreen.ctx.strokeStyle = constants.primaryColor;
    this.gameScreen.ctx.stroke();
    this.gameScreen.ctx.closePath();

    this.gameScreen.writeLeft(`Score: ${this.score}`, 15, 35, 15);
  }

  handleWait() {
    this.gameScreen.writeCenter('Press SPACE to start', 12);

    if (this.inputs.spacePressed) {
      this.setGameState('PLAY');
    }
  }

  handlePlay() {
    this.snake.update();
    this.snake.draw();
    this.apple.draw();

    this.handleInputs();
  }

  handleLose() {
    this.gameScreen.write('You lost =(', this.gameScreen.canvas.width / 2, this.gameScreen.canvas.height / 2 + 10, 16);
    this.gameScreen.write(
      'Press SPACE to restart',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 40
    );

    if (this.inputs.spacePressed) {
      this.restart();
    }
  }

  loop() {
    switch (this.gameState) {
      case 'WAIT':
        this.handleWait();
        break;
      case 'PLAY':
        this.handlePlay();
        break;
      case 'LOSE':
        this.handleLose();
        break;
      default:
        break;
    }

    this.draw();
  }
}
