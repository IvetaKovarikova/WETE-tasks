let matrix;
let grid_size;

const createMatrixChange = (row, column, value) => {
  return { row: row, column: column, value: value };
};

const getNeighbors = (row, column) => [
  matrix[row - 1]?.[column + 1],
  matrix[row - 1]?.[column],
  matrix[row - 1]?.[column - 1],
  matrix[row]?.[column - 1],
  matrix[row + 1]?.[column - 1],
  matrix[row + 1]?.[column],
  matrix[row + 1]?.[column + 1],
  matrix[row]?.[column + 1],
];

const getLiveNeighborsCount = (row, column) =>
  getNeighbors(row, column).filter((x) => x === 1).length;

const firstRule = (count) => count < 2;
const secondRule = (count) => count === 2 || count === 3;
const thirdRule = (count) => count > 3;
const fourthRule = (count) => count === 3;

const calculateCellDestiny = (row, column) => {
  const liveNeighborsCount = getLiveNeighborsCount(row, column);

  //this cell is dead
  if (!matrix[row][column])
    return fourthRule(liveNeighborsCount)
      ? createMatrixChange(row, column, 1)
      : null;

  //this cell is alive
  if (firstRule(liveNeighborsCount)) return createMatrixChange(row, column, 0);
  if (secondRule(liveNeighborsCount)) return null; //stays alive
  if (thirdRule(liveNeighborsCount)) return createMatrixChange(row, column, 0);
};

const tickOfLife = () => {
  const changesToHappen = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      changesToHappen.push(calculateCellDestiny(i, j));
    }
  }
  return changesToHappen.filter(Boolean);
};

onmessage = (e) => {
  const msg = e.data;

  switch (msg.type) {
    case "start":
      [matrix, GRID_SIZE] = msg.data;
      break;

    case "tick":
      const changes = tickOfLife();
      postMessage(changes);
      changes.forEach((change) => {
        matrix[change.row][change.column] = change.value;
      });
      break;
  }
};
