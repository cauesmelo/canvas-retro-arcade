import { Timer } from './timer';
import { Inputs } from './inputs';
import { Breakout } from '../breakout';
import { GameScreen } from './gameScreen';
import { CoronaInvaders } from '../coronaInvaders';

export class Engine {
  constructor({ canvas, title }) {
    this.gameScreen = new GameScreen(canvas);
    this.title = title;
    this.inputs = new Inputs(canvas);
    this.timer = new Timer();
    this.game = new CoronaInvaders({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    });

    window.changeGame = this.changeGame.bind(this);
  }

  #execute() {
    this.gameScreen.clear();
    this.timer.calcDeltaTime();
    this.game.loop();
  }

  changeGame(game) {
    switch (game) {
      case 'Breakout':
        this.game = new Breakout({
          gameScreen: this.gameScreen,
          inputs: this.inputs,
          timer: this.timer,
        });
        break;

      case 'Corona Invaders':
        this.game = new CoronaInvaders({
          gameScreen: this.gameScreen,
          inputs: this.inputs,
          timer: this.timer,
        });
        break;
      default:
        break;
    }

    this.title.innerHTML = game;
  }

  start() {
    this.interval = setInterval(this.#execute.bind(this), 16.66);
  }

  pause() {
    clearInterval(this.interval);
  }
}
