class Canvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Brick {
  constructor(x, y) {
    this.xPosition = x;
    this.yPosition = y;
    this.isVisible = true;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.color = BRICK_COLOR;
  }

  drawBrick() {
    if (this.isVisible) {
      canvasObj.ctx.beginPath();
      canvasObj.ctx.rect(
        this.xPosition,
        this.yPosition,
        this.width,
        this.height
      );
      canvasObj.ctx.fillStyle = this.color;
      canvasObj.ctx.fill();
      canvasObj.ctx.closePath();
    }
  }
}

const CANVAS_ID = "myCanvas";
const canvasObj = new Canvas(CANVAS_ID);

let xPosition = canvasObj.canvas.width / 2;
let yPosition = canvasObj.canvas.height - 30;

let xDirection = 2;
let yDirection = -2;

let ball = {
  xPosition: canvasObj.canvas.width / 2,
  yPosition: canvasObj.canvas.height - 30,
  xDirection: 2,
  yDirection: -2,
  radius: 10,
  speed: 1,
  color: "#0095DD",
};

let paddle = {
  xPosition: (canvasObj.canvas.width - 80) / 2,
  yPosition: canvasObj.canvas.height - 10,
  width: 80,
  height: 10,
  color: "#0095DD",
  speed: 7,
};

const BALL_RADIUS = ball.radius;

const MAIN_COLOR = "#0095DD";
const GAME_OVER_MSG_COLOR = "#991b1b";
const VICTORY_MSG_COLOR = "#16a34a";

let ballColor = MAIN_COLOR;
let brickColor = MAIN_COLOR;
let paddleColor = MAIN_COLOR;
let drawScoreColor = MAIN_COLOR;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 80;
let xPaddle = (canvasObj.canvas.width - PADDLE_WIDTH) / 2;

let rightPressed = false;
let leftPressed = false;

const RIGHT_KEY = "Right";
const LEFT_KEY = "Left";
const ARROW_RIGHT_KEY = "ArrowRight";
const ARROW_LEFT_KEY = "ArrowLeft";

const BRICK_ROW_COUNT = 3;
const BRICK_COLUMN_COUNT = 5;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;
const BRICK_COLOR = "#0095DD";

let interval;
let score = 0;
let gameOverFlag = false;

let bricks = [];
for (let column = 0; column < BRICK_COLUMN_COUNT; column++) {
  bricks[column] = [];
  for (let row = 0; row < BRICK_ROW_COUNT; row++) {
    let brickX = column * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
    let brickY = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
    let brick = new Brick(brickX, brickY);
    bricks[column][row] = brick;
  }
}

const drawBall = () => {
  canvasObj.ctx.beginPath();
  canvasObj.ctx.arc(
    ball.xPosition,
    ball.yPosition,
    BALL_RADIUS,
    0,
    Math.PI * 2
  );
  canvasObj.ctx.fillStyle = ballColor;
  canvasObj.ctx.fill();
  canvasObj.ctx.closePath();
};

const drawPaddle = () => {
  canvasObj.ctx.beginPath();
  canvasObj.ctx.rect(
    paddle.xPosition,
    paddle.yPosition,
    paddle.width,
    paddle.height
  );
  canvasObj.ctx.fillStyle = paddleColor;
  canvasObj.ctx.fill();
  canvasObj.ctx.closePath();
};

const drawBricks = () => {
  for (let column = 0; column < BRICK_COLUMN_COUNT; column++) {
    for (let row = 0; row < BRICK_ROW_COUNT; row++) {
      bricks[column][row].drawBrick();
    }
  }
};

const drawScore = () => {
  canvasObj.ctx.font = "16px Arial";
  canvasObj.ctx.fillStyle = drawScoreColor;
  canvasObj.ctx.fillText("Score: " + score, 8, 20);
};

const getRandomHexadecimalColor = () => {
  const HEX_LETTERS = "0123456789ABCDEF";
  let color = "#";
  for (let index = 0; index < 6; index++) {
    color += HEX_LETTERS[Math.floor(Math.random() * 16)];
  }
  return color;
};

const changeBallColor = () => {
  ballColor = getRandomHexadecimalColor();
};

const showMessage = (msg, color) => {
  let message = document.createElement("div");
  message.innerHTML = `<h2>${msg}</h2>`;
  message.style.color = color;
  message.style.textAlign = "center";

  let replayButton = document.createElement("button");
  replayButton.id = "replayButton";
  replayButton.textContent = "Rejouer";
  replayButton.addEventListener("click", () => {
    document.location.reload();
  });
  message.appendChild(replayButton);

  document.body.appendChild(message);
};

const displayGameResultMsg = () => {
  gameOverFlag = true;
  if (score >= BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
    showMessage("Super, vous avez gagné !", VICTORY_MSG_COLOR);
  } else {
    showMessage("Game Over", GAME_OVER_MSG_COLOR);
  }
  cancelAnimationFrame(interval);
};

const checkPaddleEdgeCollisions = () => {
  if (
    ball.yPosition + BALL_RADIUS > canvasObj.canvas.height - BALL_RADIUS &&
    (ball.xPosition < paddle.xPosition ||
      ball.xPosition > paddle.xPosition + paddle.width)
  ) {
    ball.xDirection = -ball.xDirection;
  } else {
    ball.yDirection = -ball.yDirection;
    ball.speed += 0.2;
  }
};

const ballCollisionAgainstWall = () => {
  if (
    ball.xPosition + ball.xDirection < BALL_RADIUS ||
    ball.xPosition + ball.xDirection > canvasObj.canvas.width - BALL_RADIUS
  ) {
    ball.xDirection = -ball.xDirection;
  }

  if (ball.yPosition + ball.yDirection < BALL_RADIUS) {
    ball.yDirection = -ball.yDirection;
  } else if (
    ball.yPosition + BALL_RADIUS >
    canvasObj.canvas.height - BALL_RADIUS
  ) {
    if (
      ball.xPosition > paddle.xPosition &&
      ball.xPosition < paddle.xPosition + paddle.width
    ) {
      checkPaddleEdgeCollisions();
    } else {
      displayGameResultMsg();
    }
  }
};

const keyPressed = (event) => {
  if (event.key == RIGHT_KEY || event.key == ARROW_RIGHT_KEY) {
    rightPressed = true;
  } else if (event.key == LEFT_KEY || event.key == ARROW_LEFT_KEY) {
    leftPressed = true;
  }
};

const keyNoPressed = (event) => {
  if (event.key == RIGHT_KEY || event.key == ARROW_RIGHT_KEY) {
    rightPressed = false;
  } else if (event.key == LEFT_KEY || event.key == ARROW_LEFT_KEY) {
    leftPressed = false;
  }
};

const ballCollisionAgainstBricks = () => {
  for (let column = 0; column < BRICK_COLUMN_COUNT; column++) {
    for (let row = 0; row < BRICK_ROW_COUNT; row++) {
      let brick = bricks[column][row];
      if (brick.isVisible) {
        if (
          ball.xPosition > brick.xPosition &&
          ball.xPosition < brick.xPosition + BRICK_WIDTH &&
          ball.yPosition > brick.yPosition &&
          ball.yPosition < brick.yPosition + BRICK_HEIGHT
        ) {
          ball.yDirection = -ball.yDirection;
          brick.isVisible = false;
          changeBallColor();
          score++;
        }
      }
    }
  }
};

const mouseMoveHandler = (event) => {
  let relativeX = event.clientX - canvasObj.canvas.offsetLeft;
  if (
    relativeX > paddle.width / 2 &&
    relativeX < canvasObj.canvas.width - paddle.width / 2
  ) {
    paddle.xPosition = relativeX - paddle.width / 2;
  }
};

const play = () => {
  canvasObj.clearCanvas();
  drawBall();
  drawBricks();
  drawPaddle();
  drawScore();
  ballCollisionAgainstWall();
  ballCollisionAgainstBricks();

  if (!gameOverFlag) {
    if (score >= BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
      displayGameResultMsg();
      gameOverFlag = true;
      cancelAnimationFrame(interval);
      return;
    }

    if (!gameOverFlag) {
      if (rightPressed) {
        paddle.xPosition += paddle.speed;
        if (paddle.xPosition + paddle.width > canvasObj.canvas.width) {
          paddle.xPosition = canvasObj.canvas.width - paddle.width;
        }
      } else if (leftPressed) {
        paddle.xPosition -= paddle.speed;
        if (paddle.xPosition < 0) {
          paddle.xPosition = 0;
        }
      }

      ball.xPosition += ball.xDirection * ball.speed;
      ball.yPosition += ball.yDirection * ball.speed;
      interval = requestAnimationFrame(play);
    }
  }
};

document.addEventListener("keydown", keyPressed, false);
document.addEventListener("keyup", keyNoPressed, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

play();
