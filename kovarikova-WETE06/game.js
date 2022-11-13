//variables to set
const GRID_SIZE =1000;
const CELL_SIZE = 10;
const LINE_WIDTH = 1;
const SPEED = 1000; //in milliseconds

let intervalID;
const resetBtn = document.querySelector(".reset");
const stopBtn = document.querySelector(".stop");
const startBtn = document.querySelector(".start");
const genCounter = document.querySelector(".stats__gen-counter");

const canvas = document.querySelector(".game__canvas");
const ctx = canvas.getContext("2d");
canvas.width = GRID_SIZE * CELL_SIZE;
canvas.height = GRID_SIZE * CELL_SIZE;

const worker = new Worker("gameWorker.js");

const drawGrid = (canvas, context) => {
  context.strokeStyle = "#636363";
  context.lineWidth = LINE_WIDTH;
  for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }

  for (let x = 0; x <= canvas.height; x += CELL_SIZE) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();
  context.closePath();
};

const createGameMatrix = () => {
  const matrix = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    matrix[i] = new Array(GRID_SIZE).fill(0);
  }
  return matrix;
};

const getSquare = (row, column) => {
  return [
    column * CELL_SIZE + LINE_WIDTH,
    row * CELL_SIZE + LINE_WIDTH,
    CELL_SIZE - 2 * LINE_WIDTH,
    CELL_SIZE - 2 * LINE_WIDTH,
  ];
};

const cellClear = (matrix, ctx, row, column) => {
  matrix[row][column] = 0;
  ctx.clearRect(...getSquare(row, column));
};

const cellFill = (matrix, ctx, row, column) => {
  matrix[row][column] = 1;
  ctx.fillStyle = "#ffdb57";
  ctx.fillRect(...getSquare(row, column));
};

const handleClickCell = (event, ctx, matrix) => {
  const cellX = Math.floor(event.offsetX / CELL_SIZE);
  const cellY = Math.floor(event.offsetY / CELL_SIZE);

  matrix[cellY][cellX]
    ? cellClear(matrix, ctx, cellY, cellX)
    : cellFill(matrix, ctx, cellY, cellX);
};

const resetGame = (ctx, matrix, genCounter) => {
  stopGame();
  genCounter.innerHTML = 0;

  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = 0; i < GRID_SIZE; i++) {
      matrix[j][i] && cellClear(matrix, ctx, j, i);
    }
  }
};

const startGame = (genCounter) => {
  if (intervalID) return;
  worker.postMessage({ type: "start", data: [matrix, GRID_SIZE] });
  intervalID = setInterval(() => {
    worker.postMessage({ type: "tick" });
    genCounter.innerHTML = parseInt(genCounter.innerHTML) + 1;
  }, SPEED);
};

const stopGame = () => {
  clearInterval(intervalID);
  intervalID = null;
};

worker.onmessage = (e) => {
  const changes = e.data;
  changes.forEach((change) => {
    change.value
      ? cellFill(matrix, ctx, change.row, change.column)
      : cellClear(matrix, ctx, change.row, change.column);
  });
};

resetBtn.addEventListener("click", () => resetGame(ctx, matrix, genCounter));
startBtn.addEventListener("click", () => startGame(genCounter));
stopBtn.addEventListener("click", stopGame);
canvas.addEventListener("click", (event) =>
  handleClickCell(event, ctx, matrix)
);

drawGrid(canvas, ctx);
const matrix = createGameMatrix();
