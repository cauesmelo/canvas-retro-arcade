import { Timer } from './timer';
import { Inputs } from './inputs';
import { Breakout } from './breakout';
import { GameScreen } from './screen';

export class Engine {
  constructor({ canvas }) {
    this.gameScreen = new GameScreen(canvas);
    this.inputs = new Inputs(canvas);
    this.timer = new Timer();
    this.game = new Breakout({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    });
  }

  #execute() {
    this.gameScreen.clear();
    this.timer.calcDeltaTime();
    this.game.loop();
  }

  start() {
    this.interval = setInterval(this.#execute.bind(this), 16.66);
  }

  pause() {
    clearInterval(this.interval);
  }
}
