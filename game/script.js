const grid = document.querySelector(".grid");
const width = 10;
const cells = [];
let currentPosition = 4;
let currentRotation = 0;
let timerId;

let score = 0;
const scoreDisplay = document.getElementById("score");

const nextGrid = document.getElementById("next-grid");
const nextCells = [];

const colors = ["orange", "red", "purple", "yellow", "cyan"];

const miniTetrominoes = [
  [1, 5, 9, 2], // L
  [1, 5, 6, 10], // Z
  [1, 4, 5, 6], // T
  [0, 1, 4, 5], // O
  [1, 5, 9, 13], // I
];
function displayNext() {
  nextCells.forEach((cell) => {
    cell.classList.remove("tetromino");
    cell.style.backgroundColor = "";
  });

  miniTetrominoes[nextRandom].forEach((index) => {
    nextCells[index].classList.add("tetromino");
    nextCells[index].style.backgroundColor = colors[nextRandom];
  });
}

// Tetromino shapes
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, 1, width + 1, width + 2],
  [1, width, width + 1, width * 2],
  [0, 1, width + 1, width + 2],
  [1, width, width + 1, width * 2],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const tetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];
let nextRandom = Math.floor(Math.random() * tetrominoes.length);
let random = nextRandom;
nextRandom = Math.floor(Math.random() * tetrominoes.length);
let current;
let color = colors[random];

// Draw / Undraw
function draw() {
  current.forEach((index) => {
    cells[currentPosition + index].classList.add("tetromino");
    cells[currentPosition + index].style.backgroundColor = color;
  });
}

function undraw() {
  current.forEach((index) => {
    cells[currentPosition + index].classList.remove("tetromino");
    cells[currentPosition + index].style.backgroundColor = "";
  });
}

// Controls
function control(e) {
  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
  else if (e.key === "ArrowDown") moveDown();
  else if (e.key === "ArrowUp") rotate();
}

// Move down
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Freeze
function freeze() {
  addScore();
  if (
    current.some(
      (index) =>
        cells[currentPosition + index + width]?.classList.contains("taken") ||
        currentPosition + index + width >= 200
    )
  ) {
    current.forEach((index) => {
      cells[currentPosition + index].classList.add("taken");
    });

    // Spawn next
    random = nextRandom;
    current = tetrominoes[random][0];
    currentRotation = 0;
    currentPosition = 4;
    color = colors[random];
    nextRandom = Math.floor(Math.random() * tetrominoes.length);

    //  Game Over?
    if (
      current.some((index) =>
        cells[currentPosition + index].classList.contains("taken")
      )
    ) {
      clearInterval(timerId);
      document.removeEventListener("keydown", control);
      document.getElementById("final-score").textContent = score;
      document.getElementById("game-over-overlay").classList.remove("hidden");
      return;
    }

    draw();
    displayNext();
  }
}
function addScore() {
  for (let i = 0; i < 200; i += width) {
    const row = [...Array(width).keys()].map((x) => x + i);

    if (row.every((index) => cells[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.textContent = score;

      row.forEach((index) => {
        cells[index].classList.remove("taken", "tetromino");
        cells[index].style.backgroundColor = "";
      });

      const removed = cells.splice(i, width);
      cells.unshift(...removed);

      cells.forEach((cell) => grid.appendChild(cell));
    }
  }
}

function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition--;
  if (
    current.some((index) =>
      cells[currentPosition + index].classList.contains("tetromino")
    )
  ) {
    currentPosition++;
  }
  draw();
}

function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  if (!isAtRightEdge) currentPosition++;
  if (
    current.some((index) =>
      cells[currentPosition + index].classList.contains("tetromino")
    )
  ) {
    currentPosition--;
  }
  draw();
}

function isAtRightEdge(rotatedShape) {
  return rotatedShape.some(
    (index) => (currentPosition + index) % width === width - 1
  );
}

function isAtLeftEdge(rotatedShape) {
  return rotatedShape.some((index) => (currentPosition + index) % width === 0);
}
function rotate() {
  undraw();
  const nextRotation = (currentRotation + 1) % 4;
  const nextShape = tetrominoes[random][nextRotation];

  if (isAtLeftEdge(nextShape) || isAtRightEdge(nextShape)) {
    draw();
    return;
  }

  currentRotation = nextRotation;
  current = nextShape;
  draw();
}

function startGame() {
  document.querySelector("#start-button").disabled = true;
  if (
    !document.getElementById("game-over-overlay").classList.contains("hidden")
  )
    return;

  if (timerId) return;

  random = nextRandom;
  nextRandom = Math.floor(Math.random() * tetrominoes.length);
  current = tetrominoes[random][currentRotation];
  color = colors[random];
  draw();
  displayNext();
  timerId = setInterval(moveDown, 1000);
  window.addEventListener(
    "keydown",
    function (e) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    },
    false
  );
  document.addEventListener("keydown", control);
}

window.addEventListener("DOMContentLoaded", () => {
  document.removeEventListener("keydown", control);
  document.querySelector("#start-button").addEventListener("click", startGame);
  for (let i = 0; i < 16; i++) {
    const div = document.createElement("div");
    nextGrid.appendChild(div);
    nextCells.push(div);
  }
  // grid
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    grid.appendChild(div);
    cells.push(div);
  }
  displayNext();
});
// restart
document.getElementById("restart-button").addEventListener("click", () => {
  // Clear grid
  cells.forEach((cell) => {
    cell.className = "";
    cell.style.backgroundColor = "";
  });

  // Reset
  score = 0;
  scoreDisplay.textContent = score;
  currentPosition = 4;
  currentRotation = 0;
  random = Math.floor(Math.random() * tetrominoes.length);
  nextRandom = Math.floor(Math.random() * tetrominoes.length);
  current = tetrominoes[random][currentRotation];
  color = colors[random];

  document.getElementById("game-over-overlay").classList.add("hidden");

  // Start game
  document.addEventListener("keydown", control);
  draw();
  displayNext();
  clearInterval(timerId);
  timerId = setInterval(moveDown, 1000);
});