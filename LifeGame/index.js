const ROWS = 50;
const COLS = 50;

let grid = [];
let running = false;
let end = false;

function initGrid() {
  for (let i = 0; i < ROWS; i++) {
    grid[i] = [];
    for (let j = 0; j < COLS; j++) {
      grid[i][j] = false;
    }
  }
}

function updateGrid() {
  let newGrid = [];
  for (let i = 0; i < ROWS; i++) {
    newGrid[i] = [];
    for (let j = 0; j < COLS; j++) {
      let count = countNeighbors(i, j);
      if (grid[i][j]) {
        newGrid[i][j] = count === 2 || count === 3;
      } else {
        newGrid[i][j] = count === 3;
      }
    }
  }
  grid = newGrid;
}

function countNeighbors(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (!(i === row && j === col)) {
        let x = (j + COLS) % COLS;
        let y = (i + ROWS) % ROWS;
        if (grid[y][x]) {
          count++;
        }
      }
    }
  }
  return count;
}

function updateBoxes() {
  let boxes = document.getElementsByClassName("box");
  for (let i = 0; i < ROWS * COLS; i++) {
    let box = boxes[i];
    let row = Math.floor(i / COLS);
    let col = i % COLS;
    if (grid[row][col]) {
      box.className = "box alive";
    } else {
      box.className = "box dead";
    }
  }
}

function step() {
  updateGrid();
  updateBoxes();
  running = false;
  document.getElementById("step").className = "";
}

function toggleCell(row, col) {
  grid[row][col] = !grid[row][col];
  updateBoxes();
}

function initGridBoxes() {
  let container = document.getElementById("grid");
  for (let i = 0; i < ROWS * COLS; i++) {
    let box = document.createElement("div");
    box.className = "box";
    let button = document.createElement("button");
    button.onclick = function() {
      if (!running) {
        let row = Math.floor(i / COLS);
        let col = i % COLS;
        toggleCell(row, col);
      }
    };
    box.appendChild(button);
    container.appendChild(box);
  }
}

function initButtons() {
  document.getElementById("step").onclick = function() {
    if (!running) {
      running = true;
      document.getElementById("step").className = "disabled";
      step();
    }
  };
  document.getElementById("stop").onclick = function() {
    running = true;
    document.getElementById("step").className = "disabled";
  };
}

function init() {
  initGrid();
  initGridBoxes();
  initButtons();
}

init();
