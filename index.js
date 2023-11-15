const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let xPosition = canvas.width / 2;
let yPosition = canvas.height - 30;

let xDirection = 2;
let yDirection = -2;

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };
  
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    xPosition += xDirection;
    yPosition += yDirection;
  };

  setInterval(draw, 10);