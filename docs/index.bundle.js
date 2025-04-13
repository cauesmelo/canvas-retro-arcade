/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Engine": () => (/* binding */ Engine)
/* harmony export */ });
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _inputs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _snake__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _gameScreen__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _breakout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _tictactoe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(14);
/* harmony import */ var _coronaInvaders__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(18);








class Engine {
  constructor({ canvas, title }) {
    this.gameScreen = new _gameScreen__WEBPACK_IMPORTED_MODULE_3__.GameScreen(canvas);
    this.title = title;
    this.inputs = new _inputs__WEBPACK_IMPORTED_MODULE_1__.Inputs(canvas);
    this.timer = new _timer__WEBPACK_IMPORTED_MODULE_0__.Timer();
    this.props = {
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    };
    this.game = new _breakout__WEBPACK_IMPORTED_MODULE_4__.BreakoutGame(this.props);

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
        this.game = new _breakout__WEBPACK_IMPORTED_MODULE_4__.BreakoutGame(this.props);
        break;

      case 'Corona Invaders':
        this.game = new _coronaInvaders__WEBPACK_IMPORTED_MODULE_6__.CoronaInvadersGame(this.props);
        break;

      case 'Snake':
        this.game = new _snake__WEBPACK_IMPORTED_MODULE_2__.SnakeGame(this.props);
        break;

      case 'TicTacToe':
        this.game = new _tictactoe__WEBPACK_IMPORTED_MODULE_5__.TicTacToeGame(this.props);
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


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Timer": () => (/* binding */ Timer)
/* harmony export */ });
class Timer {
  constructor() {
    this.delta = 0;
    this.lastUpdate = Date.now();
  }

  calcDeltaTime() {
    const now = Date.now();
    this.delta = (now - this.lastUpdate) / 10;
    this.lastUpdate = now;
  }
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Inputs": () => (/* binding */ Inputs)
/* harmony export */ });
class Inputs {
  constructor(canvas) {
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.spacePressed = false;
    this.mouseClick = {
      x: 0,
      y: 0,
      toBeHandled: false,
    };

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    canvas.addEventListener('click', this.clickHandler.bind(this), false);
  }

  clear() {
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.spacePressed = false;
    this.mouseClick = {
      x: 0,
      y: 0,
      toBeHandled: false,
    };
  }

  keyDownHandler(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'Right':
        this.rightPressed = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        this.leftPressed = true;
        break;

      case 'Up':
      case 'ArrowUp':
        this.upPressed = true;
        break;

      case 'Down':
      case 'ArrowDown':
        this.downPressed = true;
        break;

      case ' ':
        this.spacePressed = true;
        break;
    }
  }

  keyUpHandler(e) {
    switch (e.key) {
      case 'Right':
      case 'ArrowRight':
        this.rightPressed = false;
        break;

      case 'Left':
      case 'ArrowLeft':
        this.leftPressed = false;
        break;

      case 'Up':
      case 'ArrowUp':
        this.upPressed = false;
        break;

      case 'Down':
      case 'ArrowDown':
        this.downPressed = false;
        break;

      case ' ':
        this.spacePressed = false;
        break;
    }
  }

  clickHandler(e) {
    this.mouseClick = {
      x: e.layerX - e.target.offsetLeft,
      y: e.layerY - e.target.offsetTop,
      toBeHandled: true,
    };
  }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SnakeGame": () => (/* binding */ SnakeGame)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _apple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _snake__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);




const gridWidth = 45;
const gridHeight = 25;

class SnakeGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;

    this.apple = new _apple__WEBPACK_IMPORTED_MODULE_1__.Apple({ gameScreen, gridHeight, gridWidth });
    this.snake = new _snake__WEBPACK_IMPORTED_MODULE_2__.Snake({
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
    this.apple = new _apple__WEBPACK_IMPORTED_MODULE_1__.Apple({ gameScreen: this.gameScreen, gridHeight, gridWidth });
    this.snake = new _snake__WEBPACK_IMPORTED_MODULE_2__.Snake({
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
    this.gameScreen.ctx.rect(10, 50, _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth - 20, _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowHeight - 60);
    this.gameScreen.ctx.strokeStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
    this.gameScreen.ctx.stroke();
    this.gameScreen.ctx.closePath();

    this.gameScreen.writeLeft(`Score: ${this.score}`, 15, 35, 15);
  }

  handleWait() {
    this.gameScreen.writeCenter('Press SPACE to start', 12);

    if (this.inputs.spacePressed) {
      this.setGameState('PLAY');
      this.inputs.spacePressed = false;
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
    }

    this.draw();
  }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "constants": () => (/* binding */ constants),
/* harmony export */   "defaultFontSize": () => (/* binding */ defaultFontSize)
/* harmony export */ });
const defaultFontSize = 12;

const fontWithSize = (size) => `${size ?? defaultFontSize}px 'Press Start 2P'`;

const constants = {
  primaryColor: '#12ce5d',
  backgroundColor: '#000000',
  windowHeight: 320,
  windowWidth: 480,
  font: fontWithSize(defaultFontSize),
  fontWithSize,
  textAlign: 'center',
};


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Apple": () => (/* binding */ Apple)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _engine_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);



class Apple {
  constructor({ gameScreen, gridHeight, gridWidth }) {
    this.gameScreen = gameScreen;
    this.x = (0,_engine_utils__WEBPACK_IMPORTED_MODULE_1__.randomBetween)(0, gridWidth);
    this.y = (0,_engine_utils__WEBPACK_IMPORTED_MODULE_1__.randomBetween)(0, gridHeight);
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.x * 10 + 10, this.y * 10 + 50, 10, 10);
    this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();
  }
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "equals3": () => (/* binding */ equals3),
/* harmony export */   "randomBetween": () => (/* binding */ randomBetween),
/* harmony export */   "randomBoolean": () => (/* binding */ randomBoolean)
/* harmony export */ });
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomBoolean = () => Math.random() > 0.5;

const equals3 = (a, b, c) => a !== null && a === b && b === c;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Snake": () => (/* binding */ Snake)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _engine_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);



class Snake {
  constructor({ gameScreen, timer, inputs, gridHeight, gridWidth, apple, setGameState, addScore }) {
    this.gameScreen = gameScreen;
    this.timer = timer;
    this.inputs = inputs;
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.apple = apple;
    this.setGameState = setGameState;
    this.addScore = addScore;

    this.headX = 5;
    this.headY = 5;
    this.hasToGrow = false;
    this.body = [
      { x: 5, y: 4 },
      { x: 5, y: 3 },
    ];
    this.dirX = 0;
    this.dirY = 1;
    this.lastDirX = 0;
    this.lastDirY = 1;
    this.timePassed = 0;
    this.speed = 1;
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.headX * 10 + 10, this.headY * 10 + 50, 10, 10);
    this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();

    this.body.forEach((segment) => {
      this.gameScreen.ctx.beginPath();
      this.gameScreen.ctx.rect(segment.x * 10 + 10, segment.y * 10 + 50, 10, 10);
      this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
      this.gameScreen.ctx.fill();
      this.gameScreen.ctx.closePath();
    });
  }

  update() {
    this.timePassed += this.timer.delta;

    if (this.timePassed > 20 / this.speed) {
      this.move();
      this.timePassed -= 20 / this.speed;
    }
  }

  move() {
    let tempCoord = {
      x: this.headX,
      y: this.headY,
    };

    const newHeadX = this.headX + this.dirX;
    const newHeadY = this.headY + this.dirY;

    if (this.collideWithScreen(newHeadX, newHeadY)) return;

    this.headX = newHeadX;
    this.headY = newHeadY;

    this.lastDirX = this.dirX;
    this.lastDirY = this.dirY;

    this.collideWithApple();
    this.collideWithSelf();

    this.body.forEach((segment) => {
      const tempX = segment.x;
      const tempY = segment.y;

      segment.x = tempCoord.x;
      segment.y = tempCoord.y;

      tempCoord = {
        x: tempX,
        y: tempY,
      };
    });

    if (this.hasToGrow) {
      this.body.push(tempCoord);
      this.hasToGrow = false;
    }
  }

  collideWithScreen(x, y) {
    if (x > this.gridWidth || x < 0 || y < 0 || y > this.gridHeight) {
      this.setGameState('LOSE');
      return true;
    }

    return false;
  }

  collideWithApple() {
    if (this.apple.x === this.headX && this.apple.y === this.headY) {
      this.speed += 0.1;
      this.addScore(10);
      this.apple.x = (0,_engine_utils__WEBPACK_IMPORTED_MODULE_1__.randomBetween)(0, this.gridWidth);
      this.apple.y = (0,_engine_utils__WEBPACK_IMPORTED_MODULE_1__.randomBetween)(0, this.gridHeight);
      this.hasToGrow = true;
    }
  }

  collideWithSelf() {
    this.body.forEach((segment) => {
      if (segment.x === this.headX && segment.y === this.headY) {
        this.setGameState('LOSE');
      }
    });
  }

  validVel(x, y) {
    return x !== this.lastDirX && y !== this.lastDirY;
  }
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameScreen": () => (/* binding */ GameScreen)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


class GameScreen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth;
    this.canvas.height = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowHeight;
    this.ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
    this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.font;
    this.ctx.textAlign = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.textAlign;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  write(text, x, y, size, fillBg) {
    if (size) {
      this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.fontWithSize(size);
    }

    if (fillBg) {
      const fontSize = size ?? _constants__WEBPACK_IMPORTED_MODULE_0__.constants.defaultFontSize;
      const bgWidth = fontSize * text.length + fontSize;
      const bgHeight = fontSize * 2;
      this.ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.backgroundColor;
      this.ctx.fillRect(x - bgWidth / 2, y - bgHeight / 2 - fontSize / 2, bgWidth, bgHeight);
      this.ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
    }

    this.ctx.fillText(text, x, y);
    this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.font;
    this.ctx.textAlign = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.textAlign;
  }

  writeCenter(text, size) {
    if (size) {
      this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.fontWithSize(size);
    }

    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.font;
    this.ctx.textAlign = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.textAlign;
  }

  writeLeft(text, x, y, size) {
    this.ctx.textAlign = 'left';

    if (size) {
      this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.fontWithSize(size);
    }

    this.ctx.fillText(text, x, y);
    this.ctx.font = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.font;
    this.ctx.textAlign = _constants__WEBPACK_IMPORTED_MODULE_0__.constants.textAlign;
  }
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BreakoutGame": () => (/* binding */ BreakoutGame)
/* harmony export */ });
/* harmony import */ var _ball__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _paddle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _bricks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);




class BreakoutGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.paddle = new _paddle__WEBPACK_IMPORTED_MODULE_1__.Paddle({ gameScreen, inputs, timer });
    this.bricks = new _bricks__WEBPACK_IMPORTED_MODULE_2__.Bricks({ gameScreen, inputs, timer });
    this.ball = new _ball__WEBPACK_IMPORTED_MODULE_0__.Ball({
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
    this.paddle = new _paddle__WEBPACK_IMPORTED_MODULE_1__.Paddle({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    });
    this.bricks = new _bricks__WEBPACK_IMPORTED_MODULE_2__.Bricks({
      gameScreen: this.gameScreen,
      inputs: this.inputs,
      timer: this.timer,
    });
    this.ball = new _ball__WEBPACK_IMPORTED_MODULE_0__.Ball({
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
    }

    this.draw();
  }
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ball": () => (/* binding */ Ball)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _engine_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);



class Ball {
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
    this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
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

    if (this.x >= _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth - this.width) {
      this.velX *= -1;
    }

    if (this.y <= 0) {
      this.velY *= -1;
    }

    if (this.y > _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowHeight - this.height) {
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

      if ((0,_engine_utils__WEBPACK_IMPORTED_MODULE_1__.randomBoolean)()) {
        return Math.random() * (1 - 0.7) + 0.7 * -1;
      }
      return Math.random() * (1 - 0.7) + 0.7;
    })();
  }
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Paddle": () => (/* binding */ Paddle)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


class Paddle {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.x = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth / 2;
    this.y = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowHeight - 10;
    this.height = 10;
    this.width = 70;
  }

  draw() {
    this.gameScreen.ctx.beginPath();
    this.gameScreen.ctx.rect(this.x, this.y, this.width, this.height);
    this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
    this.gameScreen.ctx.fill();
    this.gameScreen.ctx.closePath();
  }

  moveLeft() {
    if (this.x > 0) this.x -= 2 * this.timer.delta;
  }

  moveRight() {
    if (this.x < _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth - this.width) this.x += 2 * this.timer.delta;
  }
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bricks": () => (/* binding */ Bricks)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


class Bricks {
  constructor({ gameScreen, inputs }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.rows = 3;
    this.columns = 5;
    this.width = 70;
    this.height = 20;
    this.bricks = [];
    this.brickCount = 15;

    for (let c = 0; c < this.columns; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        this.bricks[c][r] = { x: 0, y: 0 };
      }
    }
  }

  draw() {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        if (!this.bricks[c][r].destroyed) {
          const brickX = c * (this.width + 10) + 45;
          const brickY = r * (this.height + 10) + 40;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.gameScreen.ctx.beginPath();
          this.gameScreen.ctx.rect(brickX, brickY, this.width, this.height);
          this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
          this.gameScreen.ctx.fill();
          this.gameScreen.ctx.closePath();
        }
      }
    }
  }
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TicTacToeGame": () => (/* binding */ TicTacToeGame)
/* harmony export */ });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);



class TicTacToeGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.gameState = 'PLAY';
    this.board = new _board__WEBPACK_IMPORTED_MODULE_0__.Board({ gameScreen, setGameState: this.setGameState.bind(this) });
  }

  setGameState(newState) {
    this.gameState = newState;
  }

  restart() {
    this.gameState = 'PLAY';
    this.board = new _board__WEBPACK_IMPORTED_MODULE_0__.Board({ gameScreen: this.gameScreen, setGameState: this.setGameState.bind(this) });
  }

  handleInputs() {
    if (this.inputs.mouseClick.toBeHandled && this.board.isPlayerMove) {
      const x = Math.floor((this.inputs.mouseClick.x / _engine_constants__WEBPACK_IMPORTED_MODULE_1__.constants.windowWidth) * 3);
      const y = Math.floor((this.inputs.mouseClick.y / _engine_constants__WEBPACK_IMPORTED_MODULE_1__.constants.windowHeight) * 3);
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


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Board": () => (/* binding */ Board)
/* harmony export */ });
/* harmony import */ var _img_o_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _img_x_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17);
/* harmony import */ var _engine_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);





class Board {
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
    this.xSprite.src = _img_x_png__WEBPACK_IMPORTED_MODULE_1__;
    this.oSprite = new Image();
    this.oSprite.src = _img_o_png__WEBPACK_IMPORTED_MODULE_0__;
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
    this.gameScreen.ctx.strokeStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.primaryColor;
    this.gameScreen.ctx.rect(_engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth / 3, 10, 2, _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight - 20);
    this.gameScreen.ctx.rect((_engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth / 3) * 2, 10, 2, _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight - 20);
    this.gameScreen.ctx.rect(10, _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight / 3, _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth - 20, 2);
    this.gameScreen.ctx.rect(10, (_engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight / 3) * 2, _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth - 20, 2);
    this.gameScreen.ctx.fill();
  }

  drawX(x, y) {
    this.gameScreen.ctx.drawImage(
      this.xSprite,
      (x * _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth) / 3 + _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth / 3 / 2 - 64 / 2,
      (y * _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight) / 3 + _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight / 3 / 2 - 64 / 2,
      64,
      64
    );
  }

  drawO(x, y) {
    this.gameScreen.ctx.drawImage(
      this.oSprite,
      (x * _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth) / 3 + _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowWidth / 3 / 2 - 64 / 2,
      (y * _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight) / 3 + _engine_constants__WEBPACK_IMPORTED_MODULE_3__.constants.windowHeight / 3 / 2 - 64 / 2,
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
      if ((0,_engine_utils__WEBPACK_IMPORTED_MODULE_2__.equals3)(this.board[i][0], this.board[i][1], this.board[i][2])) {
        return this.board[i][0];
      }
    }

    for (let i = 0; i < 3; i += 1) {
      if ((0,_engine_utils__WEBPACK_IMPORTED_MODULE_2__.equals3)(this.board[0][i], this.board[1][i], this.board[2][i])) {
        return this.board[0][i];
      }
    }

    if ((0,_engine_utils__WEBPACK_IMPORTED_MODULE_2__.equals3)(this.board[0][0], this.board[1][1], this.board[2][2])) {
      return this.board[0][0];
    }

    if ((0,_engine_utils__WEBPACK_IMPORTED_MODULE_2__.equals3)(this.board[2][0], this.board[1][1], this.board[0][2])) {
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


/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "e7600c456d5e2bd4f62e.png";

/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "31603339041fb1368b0f.png";

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CoronaInvadersGame": () => (/* binding */ CoronaInvadersGame)
/* harmony export */ });
/* harmony import */ var _corona__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _syringe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);
/* harmony import */ var _bullets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);




class CoronaInvadersGame {
  constructor({ gameScreen, inputs, timer }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.score = 0;
    this.gameState = 'WAIT';

    this.bullets = new _bullets__WEBPACK_IMPORTED_MODULE_2__.Bullets({
      gameScreen: this.gameScreen,
      timer: this.timer,
    });

    this.coronas = new _corona__WEBPACK_IMPORTED_MODULE_0__.Corona({
      gameScreen: this.gameScreen,
      timer: this.timer,
      bullets: this.bullets,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });

    this.syringe = new _syringe__WEBPACK_IMPORTED_MODULE_1__.Syringe({
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

    this.bullets = new _bullets__WEBPACK_IMPORTED_MODULE_2__.Bullets({
      gameScreen: this.gameScreen,
      timer: this.timer,
    });

    this.coronas = new _corona__WEBPACK_IMPORTED_MODULE_0__.Corona({
      gameScreen: this.gameScreen,
      timer: this.timer,
      bullets: this.bullets,
      setGameState: this.setGameState.bind(this),
      addScore: this.addScore.bind(this),
    });

    this.syringe = new _syringe__WEBPACK_IMPORTED_MODULE_1__.Syringe({
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
    }

    this.draw();
  }
}


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Corona": () => (/* binding */ Corona)
/* harmony export */ });
/* harmony import */ var _img_corona_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony import */ var _engine_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);



class Corona {
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
    this.coronaSprite.src = _img_corona_png__WEBPACK_IMPORTED_MODULE_0__;
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

          if ((0,_engine_utils__WEBPACK_IMPORTED_MODULE_1__.randomBetween)(1, 100) > 95) {
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


/***/ }),
/* 20 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "56367f6582d0f3e58c0b.png";

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Syringe": () => (/* binding */ Syringe)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _img_heart_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var _img_syringe_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23);




class Syringe {
  constructor({ gameScreen, inputs, timer, bullets, setGameState }) {
    this.gameScreen = gameScreen;
    this.inputs = inputs;
    this.timer = timer;
    this.bullets = bullets;
    this.setGameState = setGameState;
    this.x = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth / 2;
    this.y = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowHeight - 42;
    this.height = 32;
    this.width = 32;
    this.canShoot = true;
    this.lifes = 3;
    this.syringeSprite = new Image();
    this.syringeSprite.src = _img_syringe_png__WEBPACK_IMPORTED_MODULE_2__;
    this.heartSprite = new Image();
    this.heartSprite.src = _img_heart_png__WEBPACK_IMPORTED_MODULE_1__;
    this.deltaShoot = 0;
  }

  draw() {
    this.gameScreen.ctx.drawImage(this.syringeSprite, this.x, this.y, this.width, this.height);
    for (let i = 0; i < this.lifes; i += 1) {
      this.gameScreen.ctx.drawImage(this.heartSprite, _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth - 65 + i * 20, 5, 16, 16);
    }

    this.checkCollision();

    if (!this.canShoot) {
      this.deltaShoot += this.timer.delta;

      if (this.deltaShoot > 50) {
        this.deltaShoot = 0;
        this.canShoot = true;
      }
    }
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= 3 * this.timer.delta;
    }
  }

  moveRight() {
    if (this.x < _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowWidth - this.width) {
      this.x += 3 * this.timer.delta;
    }
  }

  checkCollision() {
    this.bullets.instances.forEach((bullet) => {
      if (bullet.isEnemy && bullet.active) {
        if (bullet.x >= this.x + 8 && bullet.x <= this.x + 24) {
          if (bullet.y > this.y + 5) {
            this.hit();
            bullet.active = false;
          }
        }
      }
    });
  }

  shoot() {
    if (this.canShoot) {
      this.bullets.syringeShoot(this.x, this.y);
      this.inputs.spacePressed = false;
      this.canShoot = false;
      this.deltaShoot = 0;
    }
  }

  hit() {
    this.lifes -= 1;
    if (this.lifes === 0) {
      this.setGameState('LOSE');
    }
  }
}


/***/ }),
/* 22 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "c161da2f12eae7266447.png";

/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "1f561cc97a8c1e783ba0.png";

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bullets": () => (/* binding */ Bullets)
/* harmony export */ });
/* harmony import */ var _engine_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


class Bullets {
  constructor({ gameScreen, timer }) {
    this.gameScreen = gameScreen;
    this.timer = timer;
    this.instances = [];
    this.bulletVel = 3;
    this.bulletWidth = 2;
    this.bulletHeight = 10;
  }

  draw() {
    this.instances.forEach((bullet) => {
      this.gameScreen.ctx.beginPath();
      this.gameScreen.ctx.rect(bullet.x, bullet.y, this.bulletWidth, this.bulletHeight);
      this.gameScreen.ctx.fillStyle = _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.primaryColor;
      this.gameScreen.ctx.fill();
      this.gameScreen.ctx.closePath();
    });
  }

  move() {
    this.instances.forEach((bullet) => {
      if (bullet.isEnemy) {
        bullet.y += this.bulletVel * this.timer.delta;
      } else {
        bullet.y -= this.bulletVel * this.timer.delta;
      }
    });

    this.checkOutOfBounds();
    this.removeInactives();
  }

  coronaShoot(x, y) {
    this.instances.push({
      x,
      y,
      isEnemy: true,
      active: true,
    });
  }

  syringeShoot(x, y) {
    this.instances.push({
      x: x + 16,
      y: y - 10,
      isEnemy: false,
      active: true,
    });
  }

  checkOutOfBounds() {
    this.instances.forEach((b) => {
      if (b.y < -10 || b.y > _engine_constants__WEBPACK_IMPORTED_MODULE_0__.constants.windowHeight) {
        b.active = false;
      }
    });
  }

  removeInactives() {
    this.instances = this.instances.filter((b) => b.active);
  }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const main = () => {
  const engine = new _engine__WEBPACK_IMPORTED_MODULE_0__.Engine({
    canvas: document.querySelector('canvas'),
    title: document.querySelector('h2'),
  });

  engine.start();
};

main();

})();

/******/ })()
;