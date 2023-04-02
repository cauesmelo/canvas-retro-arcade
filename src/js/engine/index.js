import { Timer } from './timer';
import { Inputs } from './inputs';
import { SnakeGame } from '../snake';
import { GameScreen } from './gameScreen';
import { BreakoutGame } from '../breakout';
import { TicTacToeGame } from '../tictactoe';
import { CoronaInvadersGame } from '../coronaInvaders';

export class Engine {
  constructor({ canvas, title }) {
    this.gameScreen = new GameScreen(canvas);
    this.title = title;
    this.inputs = new Inputs(canvas);
    this.timer = new Timer();
    this.props = {
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    };
    this.game = new BreakoutGame(this.props);

    window.changeGame = this.changeGame.bind(this);
  }

  #execute() {
    this.gameScreen.clear();
    this.timer.calcDeltaTime();
    this.game.loop();
  }

  changeGame(game) {
    this.inputs.clear();

    switch (game) {
      case 'Breakout':
        this.game = new BreakoutGame(this.props);
        break;

      case 'Corona Invaders':
        this.game = new CoronaInvadersGame(this.props);
        break;

      case 'Snake':
        this.game = new SnakeGame(this.props);
        break;

      case 'TicTacToe':
        this.game = new TicTacToeGame(this.props);
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
