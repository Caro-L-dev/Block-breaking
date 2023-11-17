const CANVAS_ID = "myCanvas";
const canvas = document.getElementById(CANVAS_ID);
// @ts-ignore
const ctx = canvas.getContext("2d");

// @ts-ignore
let xPosition = canvas.width / 2;
// @ts-ignore
let yPosition = canvas.height - 30;

let xDirection = 2;
let yDirection = -2;

const BALL_RADIUS = 10;
let ballSpeed = 1;

const MAIN_COLOR = "#0095DD";
const GAME_OVER_MSG_COLOR = "#991b1b";
const VICTORY_MSG_COLOR = "#16a34a";

let ballColor = MAIN_COLOR;
let brickColor = MAIN_COLOR;
let paddleColor = MAIN_COLOR;
let drawScoreColor = MAIN_COLOR;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 80;
// @ts-ignore
let xPaddle = (canvas.width - PADDLE_WIDTH) / 2;

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

let interval;
let score = 0;
let gameOverFlag = false;

let bricks = [];
for (let column = 0; column < BRICK_COLUMN_COUNT; column++) {
  bricks[column] = [];
  for (let row = 0; row < BRICK_ROW_COUNT; row++) {
    // @ts-ignore
    bricks[column][row] = { xPosition: 0, yPosition: 0, isVisible: 1 };
  }
}

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(xPosition, yPosition, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  // @ts-ignore
  ctx.rect(xPaddle, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  for (let column = 0; column < BRICK_COLUMN_COUNT; column++) {
    for (let row = 0; row < BRICK_ROW_COUNT; row++) {
      if (bricks[column][row].isVisible) {
        let brickX = column * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
        let brickY = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
        bricks[column][row].xPosition = brickX;
        bricks[column][row].yPosition = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
        ctx.fillStyle = brickColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = drawScoreColor;
  ctx.fillText("Score: " + score, 8, 20);
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
    // @ts-ignore
    yPosition + BALL_RADIUS > canvas.height - BALL_RADIUS &&
    (xPosition < xPaddle || xPosition > xPaddle + PADDLE_WIDTH)
  ) {
    xDirection = -xDirection;
  } else {
    yDirection = -yDirection;
    ballSpeed += 0.2;
  }
};

const ballCollisionAgainstWall = () => {
  if (
    xPosition + xDirection < BALL_RADIUS ||
    // @ts-ignore
    xPosition + xDirection > canvas.width - BALL_RADIUS
  ) {
    xDirection = -xDirection;
  }

  if (yPosition + yDirection < BALL_RADIUS) {
    yDirection = -yDirection;
    // @ts-ignore
  } else if (yPosition + BALL_RADIUS > canvas.height - BALL_RADIUS) {
    if (xPosition > xPaddle && xPosition < xPaddle + PADDLE_WIDTH) {
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
          xPosition > brick.xPosition &&
          xPosition < brick.xPosition + BRICK_WIDTH &&
          yPosition > brick.yPosition &&
          yPosition < brick.yPosition + BRICK_HEIGHT
        ) {
          yDirection = -yDirection;
          brick.isVisible = false;
          changeBallColor();
          score++;
        }
      }
    }
  }
};

const mouseMoveHandler = (event) => {
  // @ts-ignore
  let relativeX = event.clientX - canvas.offsetLeft;
  if (
    relativeX > PADDLE_WIDTH / 2 &&
    // @ts-ignore
    relativeX < canvas.width - PADDLE_WIDTH / 2
  ) {
    xPaddle = relativeX - PADDLE_WIDTH / 2;
  }
};

const play = () => {
  // @ts-ignore
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        xPaddle += 7;
        // @ts-ignore
        if (xPaddle + PADDLE_WIDTH > canvas.width) {
          // @ts-ignore
          xPaddle = canvas.width - PADDLE_WIDTH;
        }
      } else if (leftPressed) {
        xPaddle -= 7;
        if (xPaddle < 0) {
          xPaddle = 0;
        }
      }

      xPosition += xDirection * ballSpeed;
      yPosition += yDirection * ballSpeed;
      interval = requestAnimationFrame(play);
    }
  }
};

document.addEventListener("keydown", keyPressed, false);
document.addEventListener("keyup", keyNoPressed, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

play();
