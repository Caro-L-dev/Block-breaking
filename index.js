const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let xPosition = canvas.width / 2;
let yPosition = canvas.height - 30;

let xDirection = 2;
let yDirection = -2;

let ballRadius = 10;
let initialBallColor = "#0095DD";
let ballSpeed = 2;

const paddleHeight = 10;
const paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;


const drawBall = () => {
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, ballRadius, 10, 0, Math.PI * 2);
    ctx.fillStyle = initialBallColor;
    ctx.fill();
    ctx.closePath();
};

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
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
    initialBallColor = getRandomHexadecimalColor();
};


const ballCollisionAgainstWall = () => {
     if (xPosition + xDirection < ballRadius || xPosition + xDirection > canvas.width - ballRadius) {
         xDirection = -xDirection;
         changeBallColor();
     };

    if (yPosition + yDirection < ballRadius) {
        yDirection = -yDirection;
      }  else if (yPosition + yDirection > canvas.height - ballRadius) {
            if (xPosition > paddleX && xPosition < paddleX + paddleWidth) {
                yDirection = -yDirection;
                ballSpeed += 0.2;
            } else {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }
    };   
};
  
const ballPath = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    xPosition += xDirection * ballSpeed;
    yPosition += yDirection * ballSpeed;
    ballCollisionAgainstWall();

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
      };  
};

const keyPressed = (event) => {
    if (event.key == "Right" || event.key == "ArrowRight") {
      rightPressed = true;
    } else if (event.key == "Left" || event.key == "ArrowLeft") {
      leftPressed = true;
    };
};
  
const keyNoPressed = (event) => {
    if (event.key == "Right" || event.key == "ArrowRight") {
        rightPressed = false;
    } else if (event.key == "Left" || event.key == "ArrowLeft") {
        leftPressed = false;
    };
};

document.addEventListener("keydown", keyPressed, false);
document.addEventListener("keyup", keyNoPressed, false);

let interval = setInterval(ballPath, 10);