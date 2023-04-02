import { Corona } from './corona';
import { Syringe } from './syringe';
import { Bullets } from './bullets';

export class CoronaInvadersGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.score = 0;
    this.gameState = 'WAIT';

    this.bullets = new Bullets({
      gameScreen: this.gameScreen,
      timer: this.timer,
    });

    this.coronas = new Corona({
      gameScreen: this.gameScreen,
      timer: this.timer,
      bullets: this.bullets,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });

    this.syringe = new Syringe({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
      bullets: this.bullets,
      setGameState: this.setGameState.bind(this),
    });
  }

  setGameState(newState) {
    this.gameState = newState;
  }

  addScore(value) {
    this.score += value;
  }

  restart() {
    this.score = 0;
    this.gameState = 'WAIT';

    this.bullets = new Bullets({
      gameScreen: this.gameScreen,
      timer: this.timer,
    });

    this.coronas = new Corona({
      gameScreen: this.gameScreen,
      timer: this.timer,
      bullets: this.bullets,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });

    this.syringe = new Syringe({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
      bullets: this.bullets,
      setGameState: this.setGameState.bind(this),
    });
  }

  handleWait() {
    this.gameScreen.writeCenter('Press SPACE to start', 12);

    if (this.inputs.spacePressed) {
      this.setGameState('PLAY');
      this.inputs.spacePressed = false;
    }
  }

  handleInputs() {
    if (this.inputs.rightPressed) {
      this.syringe.moveRight();
    }

    if (this.inputs.leftPressed) {
      this.syringe.moveLeft();
    }

    if (this.inputs.spacePressed) {
      this.syringe.shoot();
    }
  }

  handlePlay() {
    this.bullets.move();
    this.coronas.move();

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
    this.syringe.draw();
    this.bullets.draw();
    this.coronas.draw();

    this.gameScreen.writeLeft(`Score: ${this.score}`, 10, 20, 12);
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
