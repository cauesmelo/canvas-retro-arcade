export class Inputs {
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
