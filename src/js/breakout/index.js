import { Ball } from './ball';
import { Paddle } from './paddle';
import { Bricks } from './bricks';

export class Breakout {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.paddle = new Paddle({ gameScreen, inputs, timer });
    this.bricks = new Bricks({ gameScreen, inputs, timer });
    this.ball = new Ball({
      gameScreen,
      inputs,
      timer,
      paddle: this.paddle,
      bricks: this.bricks,
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
    this.gameScreen.clear();
    this.paddle = new Paddle({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    });
    this.bricks = new Bricks({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    });
    this.ball = new Ball({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
      paddle: this.paddle,
      bricks: this.bricks,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });
    this.score = 0;
    this.gameState = 'WAIT';
  }

  handleWait() {
    this.gameScreen.writeCenter('Press SPACE to start', 12);
    this.handleInputs();
    this.ball.setPosition(this.paddle.x + this.paddle.width / 2 - 5, this.paddle.y - 10);

    if (this.inputs.spacePressed) {
      this.ball.launch();
      this.setGameState('PLAY');
    }
  }

  handleInputs() {
    if (this.inputs.rightPressed) {
      this.paddle.moveRight();
    }

    if (this.inputs.leftPressed) {
      this.paddle.moveLeft();
    }
  }

  handlePlay() {
    this.ball.move();
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

  handleWin() {
    this.gameScreen.write('You won!', this.gameScreen.canvas.width / 2, this.gameScreen.canvas.height / 2 + 10, 16);
    this.gameScreen.write(
      'Press SPACE to restart',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 40
    );

    if (this.inputs.spacePressed) {
      this.restart();
    }
  }

  draw() {
    this.ball.draw();
    this.paddle.draw();
    this.bricks.draw();
    this.gameScreen.writeLeft(`Score:${this.score}`, 10, 30, 15);
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
      case 'WIN':
        this.handleWin();
        break;
      default:
        break;
    }

    this.draw();
  }
}
