// utils.js
const getRandomHexadecimalColor = () => {
  const letters = "0123456789ABCDEF";
  return (
    "#" +
    Array.from(
      { length: 6 },
      () => letters[Math.floor(Math.random() * 16)]
    ).join("")
  );
};

const changeBallColor = () => {
  ballColor = getRandomHexadecimalColor();
};

const gameOver = () => {
  if (!gameOverFlag) {
    gameOverFlag = true;
    let gameOverMessage = document.createElement("div");
    gameOverMessage.innerHTML = "<h2>Game Over</h2>";
    gameOverMessage.style.color = gameOverMessageColor;
    gameOverMessage.style.textAlign = "center";

    let replayButton = document.createElement("button");
    replayButton.id = "replayButton";
    replayButton.textContent = "Rejouer";
    replayButton.addEventListener("click", () => {
      document.location.reload();
    });
    gameOverMessage.appendChild(replayButton);

    document.body.appendChild(gameOverMessage);

    cancelAnimationFrame(interval);
  }
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
