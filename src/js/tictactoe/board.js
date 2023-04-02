import oPNG from '../../img/o.png';
import xPNG from '../../img/x.png';
import { equals3 } from '../engine/utils';
import { constants } from '../engine/constants';

export class Board {
  constructor({ gameScreen, setGameState }) {
    this.gameScreen = gameScreen;
    this.setGameState = setGameState;

    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    this.isPlayerMove = true;
    this.movesLeft = 9;
    this.xSprite = new Image();
    this.xSprite.src = xPNG;
    this.oSprite = new Image();
    this.oSprite.src = oPNG;
  }

  putX(x, y) {
    if (this.board[x][y] === null) {
      this.isPlayerMove = false;
      this.board[x][y] = 1;
      this.movesLeft -= 1;
    }
  }

  putO(x, y) {
    this.board[x][y] = 0;
    this.movesLeft -= 1;
    this.isPlayerMove = true;
  }

  draw() {
    this.board.forEach((c, x) =>
      c.forEach((r, y) => {
        if (r === 0) {
          this.drawO(x, y);
        }

        if (r === 1) {
          this.drawX(x, y);
        }
      })
    );

    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.strokeStyle = constants.primaryColor;
    this.gameScreen.ctx.rect(constants.windowWidth / 3, 10, 2, constants.windowHeight - 20);
    this.gameScreen.ctx.rect((constants.windowWidth / 3) * 2, 10, 2, constants.windowHeight - 20);
    this.gameScreen.ctx.rect(10, constants.windowHeight / 3, constants.windowWidth - 20, 2);
    this.gameScreen.ctx.rect(10, (constants.windowHeight / 3) * 2, constants.windowWidth - 20, 2);
    this.gameScreen.ctx.fill();
  }

  drawX(x, y) {
    this.gameScreen.ctx.drawImage(
      this.xSprite,
      (x * constants.windowWidth) / 3 + constants.windowWidth / 3 / 2 - 64 / 2,
      (y * constants.windowHeight) / 3 + constants.windowHeight / 3 / 2 - 64 / 2,
      64,
      64
    );
  }

  drawO(x, y) {
    this.gameScreen.ctx.drawImage(
      this.oSprite,
      (x * constants.windowWidth) / 3 + constants.windowWidth / 3 / 2 - 64 / 2,
      (y * constants.windowHeight) / 3 + constants.windowHeight / 3 / 2 - 64 / 2,
      64,
      64
    );
  }

  isGameOver() {
    const winner = this.checkWinner();

    if (winner === 1) {
      this.setGameState('WIN');
    }

    if (winner === 0) {
      this.setGameState('LOSE');
    }

    if (winner === -1) {
      this.setGameState('DRAW');
    }
  }

  checkWinner() {
    for (let i = 0; i < 3; i += 1) {
      if (equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
        return this.board[i][0];
      }
    }

    for (let i = 0; i < 3; i += 1) {
      if (equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
        return this.board[0][i];
      }
    }

    if (equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
      return this.board[0][0];
    }

    if (equals3(this.board[2][0], this.board[1][1], this.board[0][2])) {
      return this.board[2][0];
    }

    if (this.movesLeft === 0) {
      return -1;
    }
  }

  #evaluate() {
    if (this.checkWinner() === 0) return 10;
    if (this.checkWinner() === 1) return 0;
    if (this.checkWinner() === -1) return 5;
  }

  /*
  Minimax Algorithm, for reference see:
  https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-setnull-introduction/
  https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
  */
  #minimax(depth, isMax) {
    const algScore = this.#evaluate();

    if (algScore === 10 || algScore === 0 || algScore === 5) return algScore;

    if (isMax) {
      let best = -Infinity;

      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          if (this.board[i][j] === null) {
            this.putO(i, j);

            best = Math.max(best, this.#minimax(depth + 1, !isMax));

            this.board[i][j] = null;
            this.movesLeft += 1;
          }
        }
      }
      return best;
    }

    let best = Infinity;

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (this.board[i][j] === null) {
          this.putX(i, j);

          best = Math.min(best, this.#minimax(depth + 1, !isMax));

          this.board[i][j] = null;
          this.movesLeft += 1;
        }
      }
    }
    return best;
  }

  playerMove(x, y) {
    this.putX(x, y);
    this.isGameOver();
  }

  computerMove() {
    if (!this.isPlayerMove && this.movesLeft) {
      let bestVal = -Infinity;
      let bestX;
      let bestY;

      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          if (this.board[i][j] === null) {
            this.putO(i, j);

            const moveVal = this.#minimax(0, false);

            this.board[i][j] = null;
            this.movesLeft += 1;

            if (moveVal > bestVal) {
              bestX = i;
              bestY = j;
              bestVal = moveVal;
            }
          }
        }
      }

      this.putO(bestX, bestY);
      this.isGameOver();
    }
  }

  update() {
    if (!this.isPlayerMove) {
      this.computerMove();
    }
  }
}
