// ============Entregas para a tarefa
// 1. Ranking remoto atualizado se forma automática
// 2. Breakout
// 3. Corona Invaders
// 4. Snake
// 5. Tic tac toe com inteligência artificial

// ============= Ranking
// pega elementos
const introContainer = document.querySelector(".introContainer");
const nameInput = document.querySelector("#nameInput");
const contentContainer = document.querySelector(".contentContainer");
const rankingContainer = document.querySelector(".rankingContainer");
const pleaseElement = document.querySelector("#please");
const listOfRanking = document.querySelector(".listOfRanking");
const rankLoading = document.querySelector(".rankLoading");
const coronaRank = document.querySelector("#coronaRank");
const breakoutRank = document.querySelector("#breakoutRank");
const snakeRank = document.querySelector("#snakeRank");

// Endpoints
const endpoint = "https://api.npoint.io/1efd475f96a8b3f3f553";

// guarda o username
let userName;

// guarda se ranking ja foi atualizado remotamente
let rankSent = false;

// guarda ranking atual
let ranking;

// sai da tela de nome para tela de jogo
const startFliperama = () => {
  if (nameInput.value === "") {
    pleaseElement.style.opacity = "100";
  } else {
    userName = nameInput.value;
    introContainer.style.display = "none";
    contentContainer.style.display = "block";
  }
};

// busca o ranking remoto e atualiza localmente
const updateRanking = async () => {
  ranking = await (await fetch(endpoint)).json();
};

// publica um novo ranking remotamente
const postRanking = async (updatedRank) => {
  await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRank),
  });

  ranking = updatedRank;
};

// função para abrir a tela de ranking
const openRanking = async () => {
  contentContainer.style.display = "none";
  rankingContainer.style.display = "block";

  listOfRanking.style.display = "none";
  rankLoading.style.display = "block";

  // atualiza os rankings
  await updateRanking();

  // cria um array de ranking para iterar
  let ranks = [breakoutRank, snakeRank, coronaRank];

  // para cada rank vai criando elementos em tela
  ranks.forEach((rank) => {
    // zeramos o conteudo do elemento
    rank.innerHTML = "";

    // criamos uma string pra ir guardando o html
    let rankDraft = "";

    // o nome localmente ta "snakeRank", mas remotamente esta somente "snake"
    // p resolver isso cortamos as 4 ultimas letras
    let rankName = rank.id.slice(0, -4);

    ranking[rankName].forEach((i, index) => {
      // pra cada posicao vamos concatenando na string
      rankDraft += `<li>${index + 1}. <span class="rankName">${i.name}</span> ${
        i.points
      }</li>`;
    });

    // por ultimo pegamos esse html e colocamos no inner do elemento
    rank.innerHTML = rankDraft;
  });

  rankLoading.style.display = "none";
  listOfRanking.style.display = "block";
};

// funcao a ser chamada ao final de cada jogo para verificarmos se o rank
// deve ser atualizado e caso seja, montamos um novo objeto
// e chamamos o metodo para postar novo rank
const handleNewRank = async (rankName) => {
  // atualiza ranking
  await updateRanking();

  // para saber se devemos subir novo rank ou não
  let shouldRankBeUpdated = false;

  // faz uma copia
  const newRanking = ranking;

  // se tiver menos que 5 entradas no ranking, insere no final
  if (newRanking[rankName].length < 5) {
    shouldRankBeUpdated = true;
    newRanking[rankName].push({ name: userName, points: score });

    // se existir algum rank com score menor, inserimos ao final
  } else if (newRanking[rankName].some((rank) => rank.score <= score)) {
    shouldRankBeUpdated = true;
    newRanking[rankName].push({ name: userName, points: score });
  }

  // se o rank precisar ser atualizado
  if (shouldRankBeUpdated) {
    // ordenamos o ranking
    newRanking[rankName].sort((a, b) => b.points - a.points);

    // se tiver mais que 5 entradas, remove o ultimo
    if (newRanking[rankName].length > 5) {
      newRanking[rankName].pop();
    }

    // por fim, fazemos a requisição
    postRanking(newRanking);
  }
};

// ========= PREFACIO DOS JOGOS ===========
// O jogo funciona dentro de um loop eterno(função denominada gameLoop),
// que executa, a limpeza de tela, lógica do jogo e desenho de todos os
// elementos no jogo a cada 16.66 milisegundos, gerando um total de
// aproximadamente 60frames por segundo.
//
// Nesse ciclo de vida de 1 frame o gameloop vai:
// 1. Limpar a tela, ou seja, apaga tudo que estiver desenhado na tela
// 2. Executar uma lógica de jogo, ou seja, se estiver selecionado "snake",
//    ele checa se a cobra precisa ser movida, se sim, ajusta o x e y dela,
//    checa as colisões, e realiza qualquer outro ajuste de variável necessária.
// 3. Por fim, com as variáveis atualizadas, ele desenha todos os elementos na
//    tela.
//
// O que foi feito aqui foram 5 jogos distintos, utilizando javascript puro,
// utilizando o elemento HTML Canvas, a gente consegue desenhar elementos na
// na tela, e com o setInterval conseguimos realizar a temporização do gameloop.
// =============================

// Constantes gerais
const primaryColor = "#12ce5d";
const backgroundColor = "#000000";
const windowHeight = 320;
const windowWidth = 480;

// ====Código compartilhado
// Estado geral
let selectedGame = "Breakout";
let isGameOver = false;
let isGameWin = false;
let isGameStarted = false;
let score = 0;

// Handler de game select
const handleChangeGame = (game) => {
  // basicamene zero as variaveis
  selectedGame = game;
  titleText.innerText = game;
  isGameOver = false;
  isGameWin = false;
  isGameStarted = false;
  score = 0;
  mouseClick.toBeHandled = false;
  rankingContainer.style.display = "none";
  contentContainer.style.display = "block";

  // Da blur nos botões html para evitar que a tecla espaço ative eles novamente
  document.querySelectorAll("button").forEach((b) => b.blur());
};

// Pega canvas, contexto e header de titulo
const canvas = document.getElementById("gameCanvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
const ctx = canvas.getContext("2d");
const titleText = document.getElementById("gameTitle");

// Helpers para escrita em tela
const write = (text, x, y, fontSize) => {
  if (fontSize) {
    ctx.font = `${fontSize}px 'Press Start 2P'`;
  }
  ctx.fillText(text, x, y);
  ctx.font = "12px 'Press Start 2P'";
};

const writeLeft = (text, x, y, fontSize) => {
  ctx.textAlign = "left";
  if (fontSize) {
    ctx.font = `${fontSize}px 'Press Start 2P'`;
  }
  ctx.fillText(text, x, y);
  ctx.font = "12px 'Press Start 2P'";
  ctx.textAlign = "center";
};

// Configurações padrão para escrita em tela
ctx.font = "12px 'Press Start 2P'";
ctx.fillStyle = primaryColor;
ctx.textAlign = "center";

// Guarda tempo para calcular o delta time
let lastUpdate = Date.now();
let deltaTime = 0;

// Controles
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;
let mouseClick = {
  x: 0,
  y: 0,
  toBeHandled: false,
};

// Funções para tratar inputs
const keyDownHandler = (e) => {
  switch (e.key) {
    case "ArrowRight":
    case "Right":
      rightPressed = true;
      break;
    case "Left":
    case "ArrowLeft":
      leftPressed = true;
      break;
    case "Up":
    case "ArrowUp":
      upPressed = true;
      break;
    case "Down":
    case "ArrowDown":
      downPressed = true;
      break;
    case " ":
      spacePressed = true;
      break;
  }
};

const keyUpHandler = (e) => {
  switch (e.key) {
    case "Right":
    case "ArrowRight":
      rightPressed = false;
      break;
    case "Left":
    case "ArrowLeft":
      leftPressed = false;
      break;
    case "Up":
    case "ArrowUp":
      upPressed = false;
      break;
    case "Down":
    case "ArrowDown":
      downPressed = false;
      break;
    case " ":
      spacePressed = false;
      break;
  }
};

const clickHandler = (e) => {
  mouseClick = {
    x: e.layerX,
    y: e.layerY,
    toBeHandled: true,
  };
};

// Cria listeners para os controles
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("click", clickHandler, false);

// Helpers de RNG
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomBoolean = () => Math.random() > 0.5;

// Função para calcular delta time
const calculateDeltaTime = () => {
  let now = Date.now();
  deltaTime = (now - lastUpdate) / 10;
  lastUpdate = now;
};

// =======BREAKOUT CODE
// ===Classe da bolinha
class Ball {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.height = 10;
    this.width = 10;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  // desenha bolota na tela
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.closePath();
  }

  // move bolota na tela
  move() {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    // Checa e trata as colisões
    this.checkCollisionWithPaddle();
    this.checkCollisionWithBricks();

    // aqui é caso bater nos limites da tela, jogamos a bolinha no lado oposto
    if (this.x <= 0) {
      this.velocityX *= -1;
    }

    if (this.x >= windowWidth - this.width) {
      this.velocityX *= -1;
    }

    if (this.y <= 0) {
      this.velocityY *= -1;
    }

    // se bater no chão, é game over playboy
    if (this.y > windowHeight - this.height) {
      isGameOver = true;
    }
  }

  // se colidir com raquete, joga pra cima e aumenta velocidade
  checkCollisionWithPaddle() {
    if (this.x >= paddle.x && this.x <= paddle.x + paddle.width) {
      if (this.y >= paddle.y - this.height) {
        this.velocityY *= -1;
        this.increaseVelocity();
        return true;
      }
    }
  }

  // se colidir com os tijolinhos, anota como destruido, aumenta escore
  // e joga bolota na velocidade oposta
  checkCollisionWithBricks() {
    for (var c = 0; c < bricks.columns; c++) {
      for (var r = 0; r < bricks.rows; r++) {
        var b = bricks.bricks[c][r];
        if (!b.destroyed) {
          if (
            this.x > b.x &&
            this.x < b.x + bricks.width &&
            this.y > b.y &&
            this.y < b.y + bricks.height
          ) {
            this.velocityY *= -1;
            b.destroyed = true;
            score += 10;
            bricks.brickCount--;

            // se não sobrar mais tijolinhos, é game win baby
            if (bricks.brickCount === 0) isGameWin = true;
          }
        }
      }
    }
  }

  // função para aumentar velocidade da bolota
  increaseVelocity() {
    this.velocityX += this.velocityX > 0 ? 0.1 : -0.1;
    this.velocityY += this.velocityY > 0 ? 0.1 : -0.1;
  }

  // Seta posição da bolinha manualmente
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // Lança a bolinha
  launch() {
    isGameStarted = true;
    this.velocityY = -1;

    // Se o botão da direita tiver pressionado, lança pra direita
    // Se não, se o botão da esquerda tiver presssionado, lança pra esquerda
    // Se não, lança aleatoriamente para um dos lados
    this.velocityX = rightPressed
      ? Math.random() * (1 - 0.7) + 0.7
      : leftPressed
      ? Math.random() * (1 - 0.7) + 0.7 * -1
      : Math.random() < 0.5
      ? Math.random() * (1 - 0.7) + 0.7 * -1
      : Math.random() * (1 - 0.7) + 0.7;
  }
}

// ===Classe da raquete
class Paddle {
  constructor() {
    this.x = windowWidth / 2;
    this.y = windowHeight - 10;
    this.height = 10;
    this.width = 70;
  }

  // Desenha a raquete na tela
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.closePath();
  }

  // Move para esquerda, sempre multiplicando pela delta time para
  // não haver diferença de velocidade com mudança de fps
  moveLeft() {
    if (this.x > 0) this.x -= 5 * deltaTime;
  }

  // Move para direita
  moveRight() {
    if (this.x < windowWidth - this.width) this.x += 5 * deltaTime;
  }
}

// ===Classe de bloquinhos
class Bricks {
  constructor() {
    this.rows = 3;
    this.columns = 5;
    this.width = 70;
    this.height = 20;
    this.bricks = [];
    this.brickCount = 15;

    // cria um array de bloquinhos
    for (let c = 0; c < this.columns; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r++) {
        this.bricks[c][r] = { x: 0, y: 0 };
      }
    }
  }

  // função de desenho
  // itera pelo array de bloquinhos e vai desenhando eles na tela
  draw() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (!this.bricks[c][r].destroyed) {
          let brickX = c * (this.width + 10) + 45;
          let brickY = r * (this.height + 10) + 40;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, this.width, this.height);
          ctx.fillStyle = primaryColor;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}

// Cria objetos
let ball = new Ball();
let paddle = new Paddle();
let bricks = new Bricks();

// reinicia as variaveis do jogo
const restartBreakout = () => {
  paddle = new Paddle();
  bricks = new Bricks();
  score = 0;
  spacePressed = false;
  isGameOver = false;
  isGameStarted = false;
  isGameWin = false;
  rankSent = false;
};

// Gameloop do breakout
const breakoutGameLoop = () => {
  // se game over, moostra mensagem e da opcao para restartar
  if (isGameOver) {
    // atualiza rank remotamente
    if (rankSent === false) {
      handleNewRank("breakout");
      rankSent = true;
    }
    write("Você perdeu :(", canvas.width / 2, canvas.height / 2, 16);
    write(
      "Pressione espaço para reiniciar",
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    if (spacePressed) {
      restartBreakout();
    }

    // se game win, mostra mensagem e da opção para restartar
  } else if (isGameWin) {
    // atualiza rank remotamente
    if (rankSent === false) {
      handleNewRank("breakout");
      rankSent = true;
    }
    write("Você ganhou! :D", canvas.width / 2, canvas.height / 2, 16);
    write(
      "Pressione espaço para jogar novamente",
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    if (spacePressed) {
      restartBreakout();
    }

    // se não, roda a lógica de jogo
  } else {
    if (!isGameStarted) {
      write(
        "Pressione espaço para começar",
        canvas.width / 2,
        canvas.height / 2,
        12
      );
      bricks = new Bricks();
    }

    if (rightPressed) {
      paddle.moveRight();
    }

    if (leftPressed) {
      paddle.moveLeft();
    }

    if (isGameStarted) {
      ball.move();
    } else {
      ball.setPosition(paddle.x + paddle.width / 2 - 5, paddle.y - 10);
      if (spacePressed) {
        ball.launch();
      }
    }

    ball.draw();
    paddle.draw();
    bricks.draw();
  }

  writeLeft("Score:" + score, 10, 30, 15);
};

// =======SNAKE CODE
// Snake constants
const maxWidthGridSnake = 45;
const maxHeightGridSnake = 25;

class Apple {
  // iniciamos nossa maça em uma coordenada aleatoria
  constructor() {
    this.x = randomBetween(0, maxWidthGridSnake);
    this.y = randomBetween(0, maxHeightGridSnake);
  }

  // desenhamos nossa bela maça
  draw() {
    ctx.beginPath();
    ctx.rect(this.x * 10 + 10, this.y * 10 + 50, 10, 10);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.closePath();
  }
}

// Classe da cobrinha
class Snake {
  constructor() {
    // guardamos aqui a cabeça
    this.x = 5;
    this.y = 5;

    // Aqui é uma flag para sabermos quando a cobrinha está crescendo ou não
    this.hasToGrow = false;

    // e o corpinho salvamos em um array
    this.body = [
      { x: 5, y: 4 },
      { x: 5, y: 3 },
    ];

    // aqui é para qual eixo a cobrinha vai se movimentar
    this.velocityX = 0;
    this.velocityY = 1;

    // guardamos a ultima velocidade para que ela nao volte em direção ao seu
    // corpinho
    this.lastVelocityX = 0;
    this.lastVelocityY = 1;
  }

  draw() {
    // desenhamos a cabeça da cobrinha
    ctx.beginPath();
    ctx.rect(this.x * 10 + 10, this.y * 10 + 50, 10, 10);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.closePath();

    // iteramos pelo corpinho desenhando cada segmento
    this.body.forEach((corpinho) => {
      ctx.beginPath();
      ctx.rect(corpinho.x * 10 + 10, corpinho.y * 10 + 50, 10, 10);
      ctx.fillStyle = primaryColor;
      ctx.fill();
      ctx.closePath();
    });
  }

  // move a cobrinha na tela
  move() {
    // guardamos as coordenadas para saber para onde devemos movimentar
    // cada segmento do corpinho
    let tempCoordinates = {
      x: this.x,
      y: this.y,
    };

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.lastVelocityX = this.velocityX;
    this.lastVelocityY = this.velocityY;

    // checagem de colisão com a tela
    this.checkCollisionWithScreen();

    // checagem de colisao com a maça
    this.checkCollisionWithApple();

    // checagem de colisao com o corpinho
    this.checkCollisionWithSelf();

    // movemos cada parte do corpinho e guardamos a posição para saber
    // onde devemos posicionar o próximo
    this.body.forEach((corpinho) => {
      let tempX = corpinho.x;
      let tempY = corpinho.y;

      corpinho.x = tempCoordinates.x;
      corpinho.y = tempCoordinates.y;

      tempCoordinates = {
        x: tempX,
        y: tempY,
      };
    });

    // Se a cobrinha precisar crescer, ou seja, comeu uma maçã
    // adicionamos um corpinho na posição do rabinho
    if (this.hasToGrow) {
      this.body.push(tempCoordinates);
      this.hasToGrow = false;
    }
  }

  // Checa e trata as colisões
  checkCollisionWithScreen() {
    if (
      this.x > maxWidthGridSnake ||
      this.x < 0 ||
      this.y < 0 ||
      this.y > maxHeightGridSnake
    ) {
      isGameOver = true;
    }
  }

  checkCollisionWithApple() {
    if (apple.x === this.x && apple.y === this.y) {
      score += 10;
      apple.x = randomBetween(0, maxWidthGridSnake);
      apple.y = randomBetween(0, maxHeightGridSnake);
      this.hasToGrow = true;
    }
  }

  checkCollisionWithSelf() {
    // se as coordenadas do corpinho foram as mesmas que a cabeça
    // game over baby
    this.body.forEach((corpinho) => {
      if (corpinho.x === this.x && corpinho.y === this.y) {
        isGameOver = true;
      }
    });
  }

  // Função para sabermos de uma nova velocidade é valida para a cobrinha
  isNewVelocityValid(x, y) {
    if (x !== this.lastVelocityX && y !== this.lastVelocityY) return true;
  }
}

// Função para tratar os comandos para cobrinha
const handleSnakeInput = () => {
  if (leftPressed && snake.isNewVelocityValid(-1, 0)) {
    snake.velocityX = -1;
    snake.velocityY = 0;
  }

  if (upPressed && snake.isNewVelocityValid(0, -1)) {
    snake.velocityX = 0;
    snake.velocityY = -1;
  }

  if (rightPressed && snake.isNewVelocityValid(1, 0)) {
    snake.velocityX = 1;
    snake.velocityY = 0;
  }

  if (downPressed && snake.isNewVelocityValid(0, 1)) {
    snake.velocityX = 0;
    snake.velocityY = 1;
  }
};

// cria objetos
let snake = new Snake();
let apple = new Apple();

// Desenho de jaula, score
const drawSnakeScenario = () => {
  ctx.beginPath();
  ctx.rect(10, 50, windowWidth - 20, windowHeight - 60);
  ctx.strokeStyle = primaryColor;
  ctx.stroke();
  ctx.closePath();

  if (isGameStarted && !isGameOver) apple.draw();

  writeLeft("Score:" + score, 15, 35, 15);
};

// Guardamos tempo passado para saber quando atualizar nossa querida cobrinha
let timePassed = 0;

// função para reiniciar o jogo
const restartSnake = () => {
  snake = new Snake();
  score = 0;
  spacePressed = false;
  isGameOver = false;
  isGameStarted = true;
  isGameWin = false;
  rankSent = false;
};

// loop do jogo da cobrinha
const snakeGameLoop = () => {
  drawSnakeScenario();
  timePassed += deltaTime;

  // se game over, monta tela de gameover
  if (isGameOver) {
    if (rankSent === false) {
      handleNewRank("snake");
      rankSent = true;
    }

    write("Você perdeu :(", canvas.width / 2, canvas.height / 2, 16);
    write(
      "Pressione espaço para reiniciar",
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    if (spacePressed) {
      restartSnake();
    }

    // se game nao começou, monta tela de inicio de jogo
  } else if (!isGameStarted) {
    write("Pressione espaço para iniciar", canvas.width / 2, canvas.height / 2);

    if (spacePressed) {
      restartSnake();
    }

    // se nao, eh game on baby
  } else {
    handleSnakeInput();

    if (timePassed > 20) {
      snake.move();
      timePassed = 0;
    }
    snake.draw();
  }
};

// =======CORONA INVADERS CODE
// Load assets
let coronaSprite = new Image();
let syringeSprite = new Image();
let heartSprite = new Image();
coronaSprite.src = "assets/coronga.png";
syringeSprite.src = "assets/syringe.png";
heartSprite.src = "assets/heart.png";

// Corona constants
const bulletVelocity = 3;

// Corona class
// Mantenha o distanciamento dessa classe e use máscara!
class Corona {
  constructor() {
    this.rows = 4;
    this.columns = 15;
    this.coronas = [];
    this.coronaCount = 4 * 15;
    this.width = 16;
    this.height = 16;
    this.offsetX = 50;
    this.velocityX = 0.2;
    this.offsetY = 30;

    // Crio um array de covid, bem aglomerado do jeitinho q ele gosta
    for (let c = 0; c < this.columns; c++) {
      this.coronas[c] = [];
      for (let r = 0; r < this.rows; r++) {
        this.coronas[c][r] = { x: 0, y: 0 };
      }
    }
  }

  // a logica de desenho eh a mesma dos tijolinhos pro breakout
  // vou percorrendo por todos os covids e desenhado-os em tela
  draw() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (!this.coronas[c][r].destroyed) {
          let coronaX = c * (this.width + 10) + this.offsetX;
          let coronaY = r * (this.height + 10) + this.offsetY;
          this.coronas[c][r].x = coronaX;
          this.coronas[c][r].y = coronaY;
          ctx.drawImage(
            coronaSprite,
            coronaX,
            coronaY,
            this.width,
            this.height
          );
        }
      }
    }
  }

  // funcao de movimento
  move() {
    // vou modificando a posição dele conforme a velocidade
    this.offsetX += this.velocityX;

    // aqui basicamente vou jogando ele de um lado pro outro
    // conforme ele bate nos limites
    if (this.offsetX < 0) this.velocityX *= -1;
    if (this.offsetX > 100) this.velocityX *= -1;

    // se não existir mais corongas, é game win baby
    if (this.coronas.length === 0) {
      isGameWin = true;
    }
  }

  // funcao pra atirar
  shoot() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (!this.coronas[c][r].destroyed) {
          let coronaX = c * (this.width + 10) + this.offsetX;
          let coronaY = r * (this.height + 10) + this.offsetY;
          this.coronas[c][r].x = coronaX;
          this.coronas[c][r].y = coronaY;
          // basicamente percorro os corongas e sorteio aleatoriamente
          // se cada um deve atirar ou nao
          if (randomBetween(1, 100) > 95)
            bullets.create(true, coronaX + 8, coronaY);
        }
      }
    }
  }
}

// classe pra guardar as vidas, coisa boba
class Lifes {
  constructor() {
    this.lifes = 3;
  }

  draw() {
    for (let i = 0; i < this.lifes; i++) {
      ctx.drawImage(heartSprite, windowWidth - 65 + i * 20, 5, 16, 16);
    }
  }

  lose() {
    this.lifes -= 1;
    if (this.lifes === 0) isGameOver = true;
  }
}

// VACINE-SE, TOME A DOSE DE REFORÇO ASSIM QUE POSSIVEL
// VACINAS SALVAM VIDAS
class Syringe {
  constructor() {
    this.x = windowWidth / 2;
    this.y = windowHeight - 42;
    this.height = 32;
    this.width = 32;
    this.canShoot = true;
  }

  // Desenha a seringa na tela
  draw() {
    ctx.drawImage(syringeSprite, this.x, this.y, this.width, this.height);
  }

  // Move para esquerda, sempre multiplicando pela delta time para
  // não haver diferença de velocidade com mudança de fps
  moveLeft() {
    if (this.x > 0) this.x -= 3 * deltaTime;
  }

  // Move para direita
  moveRight() {
    if (this.x < windowWidth - this.width) this.x += 3 * deltaTime;
  }

  // Atira vacina nos coronga
  shoot() {
    if (this.canShoot) {
      bullets.create();
      spacePressed = false;
      this.canShoot = false;
    }
  }
}

// Classe para um tiro sozinho
class Bullet {
  // se for tiro do inimigo, posiciona numa coordenada passada por parametro
  // se for tiro amigo posiciona em cima da seringa
  constructor(isEnemy, x, y) {
    if (isEnemy) {
      this.x = x;
      this.y = y;
    } else {
      this.x = syringe.x + 16;
      this.y = syringe.y - 10;
    }
    this.width = 2;
    this.height = 10;
    this.isEnemy = isEnemy;
    this.active = true;
  }
}

// clase pra agrupar os tiros
class Bullets {
  constructor() {
    this.bullets = [];
  }

  // percorro as balas e as desenho em tela
  draw() {
    this.bullets.forEach((bullet) => {
      ctx.beginPath();
      ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.fillStyle = primaryColor;
      ctx.fill();
      ctx.closePath();
    });
  }

  // movo as balas de acordo com sua velocidade
  move() {
    this.bullets.forEach((bullet) => {
      if (bullet.isEnemy) {
        bullet.y += bulletVelocity * deltaTime;
      } else {
        bullet.y -= bulletVelocity * deltaTime;
      }
    });

    this.checkOutOfBounds();
    this.checkCollision();
    this.removeInactives();
  }

  // funca para criar uma nova bala e adicionar ao array de balas
  create(isEnemy, x, y) {
    this.bullets.push(new Bullet(isEnemy, x, y));
  }

  // checo se a bala foi pra fora da tela, se for eu removo
  checkOutOfBounds() {
    this.bullets = this.bullets.map((b) =>
      b.y > -10 && b.y < windowHeight ? b : { ...b, active: false }
    );
  }

  // checo colisao com player e/ou corongas
  checkCollision() {
    this.bullets.forEach((bullet) => {
      // Se for bala do inimigo checo a colisao com a seringa
      if (bullet.isEnemy && bullet.active) {
        if (bullet.x >= syringe.x + 8 && bullet.x <= syringe.x + 24) {
          if (bullet.y > syringe.y) {
            lifes.lose();
            bullet.active = false;
          }
        }

        // Se for bala do player, checo colisao com cada um dos corongas
      } else if (bullet.active) {
        // Que Deus perdoe essa complexidade cúbica
        for (let c = 0; c < coronas.columns; c++) {
          for (let r = 0; r < coronas.rows; r++) {
            if (!coronas.coronas[c][r].destroyed) {
              if (
                bullet.x >= coronas.coronas[c][r].x &&
                bullet.x <= coronas.coronas[c][r].x + 16
              ) {
                if (
                  bullet.y <= coronas.coronas[c][r].y + 16 &&
                  bullet.y <= coronas.coronas[c][r].y
                ) {
                  coronas.coronas[c][r].destroyed = true;
                  score += 10;
                  bullet.active = false;
                  coronas.coronaCount -= 1;

                  if (coronas.coronaCount === 0) isGameWin = true;
                }
              }
            }
          }
        }
      }
    });
  }

  // Removo todas as balas inativas do array
  removeInactives() {
    this.bullets = this.bullets.filter((b) => b.active);
  }
}

// instancia objetos pro jogo
let coronas = new Corona();
let syringe = new Syringe();
let bullets = new Bullets();
let lifes = new Lifes();

// guarda tempo passado p ver qnd pode atirar
let timePassedCorona = 0;

// codigo para reiniciar o jogo
const restartCorona = () => {
  coronas = new Corona();
  syringe = new Syringe();
  score = 0;
  spacePressed = false;
  isGameOver = false;
  isGameStarted = false;
  isGameWin = false;
  rankSent = false;
  lifes = new Lifes();
};

const coronaGameLoop = () => {
  // se game over, moostra mensagem e da opcao para restartar
  if (isGameOver) {
    // Chama metodo para atualizar rank remotamente
    if (rankSent === false) {
      handleNewRank("corona");
      rankSent = true;
    }
    write("Você perdeu :(", canvas.width / 2, canvas.height / 2, 16);
    write(
      "Pressione espaço para reiniciar",
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    if (spacePressed) {
      restartCorona();
    }

    // se game win, mostra mensagem e da opção para restartar
  } else if (isGameWin) {
    // Chama metodo para atualizar rank remotamente
    if (rankSent === false) {
      handleNewRank("corona");
      rankSent = true;
    }
    write("Você ganhou! :D", canvas.width / 2, canvas.height / 2, 16);
    write(
      "Pressione espaço para jogar novamente",
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    if (spacePressed) {
      restartCorona();
    }

    // se jogo não começou , mostra tela de começo
  } else if (!isGameStarted) {
    write(
      "Pressione espaço para começar",
      canvas.width / 2,
      canvas.height / 2 + 30,
      12
    );
    coronas = new Corona();
    coronas.draw();
    syringe.draw();

    if (spacePressed) {
      isGameStarted = true;
      lifes = new Lifes();
      syringe = new Syringe();
      spacePressed = false;
    }

    // se não, eh era do duelo
  } else {
    timePassedCorona += deltaTime;

    // Se ja tiver passado 50 tempinhos, permite um novo tiro e atira corongas
    if (timePassedCorona > 50) {
      syringe.canShoot = true;
      timePassedCorona = 0;
      coronas.shoot();
    }

    // funções de input
    if (rightPressed) {
      syringe.moveRight();
    }

    if (leftPressed) {
      syringe.moveLeft();
    }

    if (spacePressed) {
      syringe.shoot();
    }

    // movimentos
    bullets.move();
    coronas.move();

    // desenhos
    lifes.draw();
    bullets.draw();
    coronas.draw();
    syringe.draw();
  }

  writeLeft("Score:" + score, 10, 20, 12);
};

// =======TIC TAC TOE CODE
// classe do tabuleiro
class Board {
  constructor() {
    // array p representar o jogo
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    // variavel pra representar de quem eh a vez
    this.isPlayerMove = true;
    this.movesLeft = 9;
    this.gameWinner;
  }

  putX(x, y) {
    // se espaco tiver disponivel, joga
    if (this.board[x][y] === null) {
      this.isPlayerMove = false;
      this.board[x][y] = 1;
      this.movesLeft -= 1;
    }
  }

  // n faco verificacao pois esse eh do computador
  putO(x, y) {
    this.board[x][y] = 0;
    this.movesLeft -= 1;
    this.isPlayerMove = true;
  }

  // percorre o array e vai desenhando
  draw() {
    this.board.forEach((b, indexX) =>
      b.forEach((i, indexY) => {
        if (i === 0) {
          this.drawO(indexX, indexY);
        } else if (i === 1) {
          this.drawX(indexX, indexY);
        }
      })
    );
  }

  // funcao basica de desenho
  drawX(x, y) {
    ctx.drawImage(
      xSprite,
      (x * windowWidth) / 3 + windowWidth / 3 / 2 - 64 / 2,
      (y * windowHeight) / 3 + windowHeight / 3 / 2 - 64 / 2,
      64,
      64
    );
  }

  drawO(x, y) {
    ctx.drawImage(
      oSprite,
      (x * windowWidth) / 3 + windowWidth / 3 / 2 - 64 / 2,
      (y * windowHeight) / 3 + windowHeight / 3 / 2 - 64 / 2,
      64,
      64
    );
  }

  // Método privado para verificar se três posições são iguais e não nulas
  #equals3(a, b, c) {
    return a !== null && a === b && b === c;
  }

  // metodo para verificar se chegou ao final do jogo
  isGameOver() {
    let winner = this.checkWinner();

    if (winner === 1) {
      this.gameWinner = 1;
      isGameOver = true;
    }

    if (winner === 0) {
      this.gameWinner = 0;
      isGameOver = true;
    }

    if (winner === "draw") {
      this.gameWinner = -1;
      isGameOver = true;
    }
  }

  // método para verificar quem ganhou
  checkWinner() {
    // verifica na horizontal
    for (let i = 0; i < 3; i++) {
      if (this.#equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
        return this.board[i][0];
      }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
      if (this.#equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
        return this.board[0][i];
      }
    }

    // Diagonal
    if (this.#equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
      return this.board[0][0];
    }
    if (this.#equals3(this.board[2][0], this.board[1][1], this.board[0][2])) {
      return this.board[2][0];
    }

    // Se ngm ganho e não existem mais movimentos, eh empate
    if (this.movesLeft === 0) {
      return "draw";
    }

    // Se não for nada acima, jogo ainda ta rolando
  }

  // atribui um valor para cada possível resultado
  #evaluate() {
    // AI ganhando eh nota 10
    if (this.checkWinner() === 0) return 10;
    // Empatando o jogo eh nota 5
    if (this.checkWinner() === "draw") return 5;
    // Humano ganhando é nota 0
    if (this.checkWinner() === 1) return 0;
  }

  // ALGORITMO DE MINIMAX
  // Para uma explicação mais completa, consultar links abaixo
  // https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/
  // https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
  #minimax(depth, isMax) {
    // evaluamos a situação atual
    let algScore = this.#evaluate();

    // se tiver um valor definido, retornamos eles
    if (algScore === 10 || algScore === 0 || algScore === 5) return algScore;

    // se nao rodamos o algoritmo

    // se tiver maximizando
    if (isMax) {
      let best = -Infinity;

      // percorre o tabuleiro
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // checa se posicao esta disponivel
          if (this.board[i][j] === null) {
            // joga
            this.putO(i, j);

            // chama funcao recursivamente e retorna o maior
            best = Math.max(best, this.#minimax(depth + 1, !isMax));

            // Undo the move
            this.board[i][j] = null;
            this.movesLeft += 1;
          }
        }
      }
      return best;
    }

    // se nao, estamos minimizando
    else {
      let best = Infinity;

      // percorre tabuleiro
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // checa se ta disponivel
          if (this.board[i][j] === null) {
            // movimenta
            this.putX(i, j);

            // chama funcao recursivamente e retorna o menor
            best = Math.min(best, this.#minimax(depth + 1, !isMax));

            // desfaz movimento
            this.board[i][j] = null;
            this.movesLeft += 1;
          }
        }
      }
      return best;
    }
  }

  computerMove() {
    if (!this.isPlayerMove && this.movesLeft) {
      let bestVal = -Infinity;
      let bestX;
      let bestY;

      // percorre todas as posicoes buscando um espaço vazio e calculando
      // o resultado possivel para a jogada
      // ao final ver qual a melhor jogada e a efetua
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // verifica se ta vazio
          if (this.board[i][j] === null) {
            // joga
            this.putO(i, j);

            // verifica o valor da jogada como algoritmo minimax
            let moveVal = this.#minimax(0, false);

            // desfaz a jogada
            this.board[i][j] = null;
            this.movesLeft += 1;

            // se o valor obtido for melhor, salva
            if (moveVal > bestVal) {
              bestX = i;
              bestY = j;
              bestVal = moveVal;
            }
          }
        }
      }

      // ao final executa a melhor jogada possível
      this.putO(bestX, bestY);
      this.isGameOver();
    }
  }
}

// load assets
let xSprite = new Image();
let oSprite = new Image();
xSprite.src = "assets/x.png";
oSprite.src = "assets/o.png";

// instancia objetos
let board = new Board();

// funcoes para desenhar o cenario
const drawTicScenario = () => {
  ctx.beginPath();
  ctx.strokeStyle = primaryColor;
  ctx.rect(windowWidth / 3, 10, 2, windowHeight - 20);
  ctx.rect((windowWidth / 3) * 2, 10, 2, windowHeight - 20);
  ctx.rect(10, windowHeight / 3, windowWidth - 20, 2);
  ctx.rect(10, (windowHeight / 3) * 2, windowWidth - 20, 2);
  ctx.fill();
};

// Função para lidar com o clique do mouse
const handleClickTic = () => {
  // se tem uma ação de clique para ser tratada,
  // e for a vez do player
  // trata o clique do mouse
  if (mouseClick.toBeHandled && board.isPlayerMove) {
    // posicionamos o X de acordo como clique do usuario
    board.putX(
      Math.floor((mouseClick.x / windowWidth) * 3),
      Math.floor((mouseClick.y / 320) * 3)
    );
    mouseClick.toBeHandled = false;

    // verificamos se chegou ao final do jogo
    board.isGameOver();
  }
};

// funcao para reiniciar o jogo
const restartTic = () => {
  board = new Board();
  isGameOver = false;
};

// tratamento de clique enquanto fim de jogo
const handleClickGameOver = () => {
  if (mouseClick.toBeHandled) {
    mouseClick.toBeHandled = false;
    restartTic();
  }
};

// loopo do jogo
const ticGameloop = () => {
  // se for fim de jogo
  if (isGameOver) {
    // É impossível a AI deixar o humano ganhar :)
    if (board.gameWinner === 1) {
      write("Você ganhou :)", windowWidth / 2, windowHeight / 2);
    }

    // Caso AI vença
    if (board.gameWinner === 0) {
      write("Você perdeu :(", windowWidth / 2, windowHeight / 2);
    }

    // Caso haja empate
    if (board.gameWinner === -1) {
      write("Empate!", windowWidth / 2, windowHeight / 2);
    }

    write(
      "Clique na tela para jogar novamente",
      windowWidth / 2,
      windowHeight / 2 + 30,
      12
    );
    handleClickGameOver();

    // caso jogo esteja acontecendo
  } else {
    // desenha cenario
    drawTicScenario();

    // trata clique do mouse
    handleClickTic();

    // se for a vez do computador, faz ele jogar
    if (!board.isPlayerMove) board.computerMove();

    // desenha tabuleiro
    board.draw();
  }
};

// ===Game loop
const gameLoop = () => {
  // limpa tela e calcula delta time
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  calculateDeltaTime();

  // de acordo com o jogo selecionado, executa um game loop específico
  switch (selectedGame) {
    case "Breakout":
      breakoutGameLoop();
      break;
    case "Corona Invaders":
      coronaGameLoop();
      break;
    case "Snake":
      snakeGameLoop();
      break;
    case "TicTacToe":
      ticGameloop();
      break;
  }
};

// Configura game loop para rodar a 60fps
setInterval(gameLoop, 16.66);
