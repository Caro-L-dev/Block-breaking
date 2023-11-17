const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let xPosition = canvas.width / 2;
let yPosition = canvas.height - 30;

let xDirection = 2;
let yDirection = -2;

let ballRadius = 10;
let ballSpeed = 1;

let mainColor = "#0095DD";
let ballColor = mainColor;
let brickColor = mainColor;
let paddleColor = mainColor;
let drawScoreColor = mainColor;
let gameOverMsgColor = "#991b1b";
let victoryMsgColor = "#16a34a";

const paddleHeight = 10;
const paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let interval;
let score = 0;
let gameOverFlag = false;

let bricks = [];
for (let column = 0; column < brickColumnCount; column++) {
  bricks[column] = [];
  for (let row = 0; row < brickRowCount; row++) {
    bricks[column][row] = { xPosition: 0, yPosition: 0, isVisible: 1 };
  }
}

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(xPosition, yPosition, ballRadius, 10, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  for (let column = 0; column < brickColumnCount; column++) {
    for (let row = 0; row < brickRowCount; row++) {
      if (bricks[column][row].isVisible) {
        let brickX = column * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[column][row].xPosition = brickX;
        bricks[column][row].yPosition = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
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
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let index = 0; index < 6; index++) {
    color += letters[Math.floor(Math.random() * 16)];
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
  if (score !== brickRowCount * brickColumnCount) {
    showMessage("Game Over", gameOverMsgColor);
  } else {
    showMessage("Super, vous avez gagné !", victoryMsgColor);
  }
  cancelAnimationFrame(interval);
};

const checkPaddleEdgeCollisions = () => {
  if (
    yPosition + yDirection > canvas.height - ballRadius &&
    (xPosition < paddleX || xPosition > paddleX + paddleWidth)
  ) {
    xDirection = -xDirection;
  } else {
    yDirection = -yDirection;
    ballSpeed += 0.2;
  }
};

const ballCollisionAgainstWall = () => {
  if (
    xPosition + xDirection < ballRadius ||
    xPosition + xDirection > canvas.width - ballRadius
  ) {
    xDirection = -xDirection;
  }

  if (yPosition + yDirection < ballRadius) {
    yDirection = -yDirection;
  } else if (yPosition + yDirection > canvas.height - ballRadius) {
    if (xPosition > paddleX && xPosition < paddleX + paddleWidth) {
      checkPaddleEdgeCollisions();
    } else {
      displayGameResultMsg();
    }
  }
};

const keyPressed = (event) => {
  if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = true;
  } else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = true;
  }
};

const keyNoPressed = (event) => {
  if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = false;
  } else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = false;
  }
};

const ballCollisionAgainstBricks = () => {
  for (let column = 0; column < brickColumnCount; column++) {
    for (let row = 0; row < brickRowCount; row++) {
      let brick = bricks[column][row];
      if (brick.isVisible) {
        if (
          xPosition > brick.xPosition &&
          xPosition < brick.xPosition + brickWidth &&
          yPosition > brick.yPosition &&
          yPosition < brick.yPosition + brickHeight
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
  let relativeX = event.clientX - canvas.offsetLeft;
  if (
    relativeX > paddleWidth / 2 &&
    relativeX < canvas.width - paddleWidth / 2
  ) {
    paddleX = relativeX - paddleWidth / 2;
  }
};

const play = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBricks();
  drawPaddle();
  drawScore();
  ballCollisionAgainstWall();
  ballCollisionAgainstBricks();

  if (!gameOverFlag) {
    if (score === brickRowCount * brickColumnCount) {
      displayGameResultMsg();
      gameOverFlag = true;
      cancelAnimationFrame(interval);
      return;
    }

    if (!gameOverFlag) {
      if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
          paddleX = canvas.width - paddleWidth;
        }
      } else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
          paddleX = 0;
        }
      }

      xPosition += xDirection * ballSpeed;
      yPosition += yDirection * ballSpeed;
      interval = requestAnimationFrame(play);
    }
  }

  document.addEventListener("keydown", keyPressed, false);
  document.addEventListener("keyup", keyNoPressed, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
};

play();
