const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let xPosition = canvas.width / 2;
let yPosition = canvas.height - 30;

let xDirection = 2;
let yDirection = -2;

let ballRadius = 10;
let initialBallColor = "#0095DD";


const drawBall = () => {
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, ballRadius, 10, 0, Math.PI * 2);
    ctx.fillStyle = initialBallColor;
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
    if (yPosition + yDirection < ballRadius || yPosition + yDirection > canvas.height - ballRadius) {
        yDirection = -yDirection;
        changeBallColor();
    };

    if (xPosition + xDirection < ballRadius || xPosition + xDirection > canvas.width - ballRadius) {
        xDirection = -xDirection;
        changeBallColor();
    };
};
  
const ballPath = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    xPosition += xDirection;
    yPosition += yDirection;
    ballCollisionAgainstWall();
};

setInterval(ballPath, 10);