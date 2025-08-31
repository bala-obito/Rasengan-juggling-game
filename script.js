const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let score = 0;
let highScore = localStorage.getItem("rasenganHighScore") || 0;
document.getElementById("highScore").innerText = highScore;

let gameOver = false;
let paused = false;
let mode = "normal";

// Rasengan sound effect
const rasenganAudio = new Audio("https://www.myinstants.com/media/sounds/naruto-rasengan.mp3");

let ball = { x: 200, y: 100, dx: 2, dy: 3, r: 20 };
let hand = { x: 160, y: canvas.height - 40, w: 80, h: 20, speed: 20 };

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameUI").style.display = "block";
  restartGame();
}

function goMenu() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("gameUI").style.display = "none";
  score = 0;
}

function drawRasengan() {
  let g = ctx.createRadialGradient(ball.x, ball.y, 2, ball.x, ball.y, ball.r);
  g.addColorStop(0, "#00d4ff");
  g.addColorStop(0.4, "#00aaff");
  g.addColorStop(0.8, "#0077ff");
  g.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r * 0.6, 0, Math.PI * 1.5);
  ctx.stroke();
}

function drawHand() {
  ctx.fillStyle = "orange";
  ctx.fillRect(hand.x, hand.y, hand.w, hand.h);
}

function update() {
  if (gameOver || paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw score inside canvas
  ctx.fillStyle = "white";
  ctx.font = "20px Trebuchet MS";
  ctx.fillText("Score: " + score, 10, 30);

  drawRasengan();
  drawHand();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.dx *= -1;
  if (ball.y < ball.r) ball.dy *= -1;

  if (
    ball.y + ball.r >= hand.y &&
    ball.x >= hand.x &&
    ball.x <= hand.x + hand.w
  ) {
    ball.dy *= -1;
    ball.y = hand.y - ball.r;
    score++;
    document.getElementById("score").innerText = score;

    rasenganAudio.currentTime = 0;
    rasenganAudio.play();

    if (mode === "hard") {
      ball.dx *= 1.05;
      ball.dy *= 1.05;
    }
  }

  if (ball.y > canvas.height) {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "30px Trebuchet MS";
    ctx.fillText("Game Over!", 120, 300);
    return;
  }

  requestAnimationFrame(update);
}

function pauseGame() {
  paused = !paused;
  document.getElementById("pauseBtn").innerText = paused ? "▶️ Resume" : "⏸️ Pause";
  if (!paused) update();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") hand.x -= hand.speed;
  if (e.code === "ArrowRight") hand.x += hand.speed;
});
canvas.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  hand.x = e.clientX - rect.left - hand.w / 2;
});
canvas.addEventListener("touchmove", (e) => {
  let rect = canvas.getBoundingClientRect();
  hand.x = e.touches[0].clientX - rect.left - hand.w / 2;
});

function restartGame() {
  score = 0;
  gameOver = false;
  paused = false;
  document.getElementById("score").innerText = score;
  document.getElementById("pauseBtn").innerText = "⏸️ Pause";

  if (mode === "normal") {
    ball = { x: 200, y: 100, dx: 2, dy: 3, r: 20 };
  } else {
    ball = { x: 200, y: 100, dx: 3, dy: 4, r: 20 };
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(update); // restart loop properly
}

// Full reset: clears score, mode, AND high score
function resetGame() {
  score = 0;
  gameOver = false;
  paused = false;
  mode = "normal";
  ball = { x: 200, y: 100, dx: 2, dy: 3, r: 20 };
  hand = { x: 160, y: canvas.height - 40, w: 80, h: 20, speed: 20 };

  // Reset UI
  document.getElementById("score").innerText = score;
  document.getElementById("pauseBtn").innerText = "⏸️ Pause";

  // Clear saved high score
  localStorage.removeItem("rasenganHighScore");
  highScore = 0;
  document.getElementById("highScore").innerText = highScore;

  // Go back to menu
  document.getElementById("menu").style.display = "block";
  document.getElementById("gameUI").style.display = "none";
}

function saveScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("rasenganHighScore", highScore);
    document.getElementById("highScore").innerText = highScore;
    alert("💾 Score Saved!");
  } else {
    alert("Score not higher than High Score!");
  }
}
