const canvasWidth = 400;
const canvasHeight = 300;
const cellSize = 4;
const gridWidth = Math.floor(canvasWidth / cellSize);
const gridHeight = Math.floor(canvasHeight / cellSize);
let grid = [];
console.log(gridWidth, gridHeight);
let play = false;
function setup() {
  createCanvas(gridWidth * cellSize, gridHeight * cellSize);
  //noCursor();
  // Disable right click context menu
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  frameRate(60);
  initGrid();
}

let counter = 0;
function draw() {
  background(220);
  drawGrid();
  drawPointer();
  if (play && counter++ % 1 == 0) nextCycle(); 

}

function drawPointer() {
  stroke(255);
  noFill();
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
  rect(x * cellSize, y * cellSize, cellSize, cellSize);
}

/* #region LifeCycle */
function nextCycle() {
  // yeni grid oluştur
  nextGrid = [];
  for (let x = 0; x < gridWidth; x++) {
    nextGrid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
      nextGrid[x][y] = 0;
    }
  }

  // Kuralları işle
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      let current = grid[x][y];
      let nc = neighbourCount(x, y);

      nextCell = 0;

      if (current == 1) {
        //Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (nc < 2) nextGrid[x][y] = 0;

        //Any live cell with two or three live neighbours lives on to the next generation.
        if (nc == 2 || nc == 3) nextGrid[x][y] = 1;

        //Any live cell with more than three live neighbours dies, as if by overpopulation.
        if (nc > 3) nextGrid[x][y] = 0;

      } else {
        //Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (nc == 3) nextGrid[x][y] = 1;
      }

      if ((current == 1 && (nc == 2 || nc == 3)) || (current == 0 && nc == 3)) nextCell = 1;

      nextGrid[x][y] = nextCell;

    }
  }
  grid = nextGrid;
}

function neighbourCount(x, y) {
  let count = 0;
  x += gridWidth;
  y += gridHeight;

  let no = grid[(x + 0) % gridWidth][(y - 1) % gridHeight];
  let ne = grid[(x + 1) % gridWidth][(y - 1) % gridHeight];
  let ea = grid[(x + 1) % gridWidth][(y + 0) % gridHeight];
  let se = grid[(x + 1) % gridWidth][(y + 1) % gridHeight];
  let so = grid[(x + 0) % gridWidth][(y + 1) % gridHeight];
  let sw = grid[(x - 1) % gridWidth][(y + 1) % gridHeight];
  let we = grid[(x - 1) % gridWidth][(y + 0) % gridHeight];
  let nw = grid[(x - 1) % gridWidth][(y - 1) % gridHeight];
  if (no == 1) count++;
  if (ne == 1) count++;
  if (ea == 1) count++;
  if (se == 1) count++;
  if (so == 1) count++;
  if (sw == 1) count++;
  if (we == 1) count++;
  if (nw == 1) count++;
  return count;
}
/* #endregion */

/* #region Controls */
function mouseDragged() {
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
  if (mouseButton === LEFT) grid[x][y] = 1;
  if (mouseButton === RIGHT) grid[x][y] = 0;
}
function mousePressed() {
  mouseDragged();
}

function keyTyped() {
  //if (key == " ") nextCycle();
  if (key == " ") play = !play;
  if (key == "s") nextCycle();
  if (key == "r") randomGrid();
  if (key == "c") initGrid();
}
/* #endregion */

/* #region Grid */
function initGrid() {
  for (let x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = 0;
    }
  }
}

function drawGrid() {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (grid[x][y] === 1) {
        noStroke();
        fill(128);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function randomGrid() {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = Math.floor(random(2));
    }
  }
}
/* #endregion */
