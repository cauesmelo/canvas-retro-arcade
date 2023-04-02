import { Board } from './board';
import { constants } from '../engine/constants';

export class TicTacToeGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.gameState = 'PLAY';
    this.board = new Board({ gameScreen, setGameState: this.setGameState.bind(this) });
  }

  setGameState(newState) {
    this.gameState = newState;
  }

  restart() {
    this.gameState = 'PLAY';
    this.board = new Board({ gameScreen: this.gameScreen, setGameState: this.setGameState.bind(this) });
  }

  handleInputs() {
    if (this.inputs.mouseClick.toBeHandled && this.board.isPlayerMove) {
      const x = Math.floor((this.inputs.mouseClick.x / constants.windowWidth) * 3);
      const y = Math.floor((this.inputs.mouseClick.y / constants.windowHeight) * 3);
      this.board.playerMove(x, y);
      this.inputs.mouseClick.toBeHandled = false;
    }
  }

  handlePlay() {
    this.handleInputs();
    this.board.draw();
    this.board.update();
  }

  handleLose() {
    this.board.draw();

    this.gameScreen.write(
      'You lost =(',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 10,
      16,
      true
    );
    this.gameScreen.write(
      'Click to restart',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 40,
      12,
      true
    );

    if (this.inputs.mouseClick.toBeHandled) {
      this.inputs.mouseClick.toBeHandled = false;
      this.restart();
    }
  }

  handleWin() {
    this.board.draw();

    this.gameScreen.write(
      'You won!',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 10,
      16,
      true
    );
    this.gameScreen.write(
      'Click to restart',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 40,
      12,
      true
    );

    if (this.inputs.mouseClick.toBeHandled) {
      this.inputs.mouseClick.toBeHandled = false;
      this.restart();
    }
  }

  handleTie() {
    this.board.draw();

    this.gameScreen.write(
      `It's a tie!`,
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 10,
      16,
      true
    );
    this.gameScreen.write(
      'Click to restart',
      this.gameScreen.canvas.width / 2,
      this.gameScreen.canvas.height / 2 + 40,
      12,
      true
    );

    if (this.inputs.mouseClick.toBeHandled) {
      this.inputs.mouseClick.toBeHandled = false;
      this.restart();
    }
  }

  loop() {
    switch (this.gameState) {
      case 'PLAY':
        this.handlePlay();
        break;

      case 'LOSE':
        this.handleLose();
        break;

      case 'WIN':
        this.handleWin();
        break;

      case 'DRAW':
        this.handleTie();
        break;
    }
  }
}
