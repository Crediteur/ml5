const gridSize = 800;
const cols = 40;
const rows = 40;
const diagonals = false;
const wallDensity = 0.25;
let grid = [...Array(cols)].map(() => Array(rows).fill(0));
let openSet = [];
let closedSet = [];
let pathStart;
let pathEnd;
let path = [];

// class object for each square in the grid
class Spot {
  constructor(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;
    this.wall = false;
    if (random(1) < wallDensity) {
      this.wall = true;
    }
  }

  show(col) {
    fill(col);
    if (this.wall) fill(20);
    strokeWeight(0);
    width = gridSize / cols;
    height = gridSize / rows;
    rect(this.x * width, this.y * height, width, height);
  }

  addNeighbours(grid) {
    // find neighbours of a node based on grid
    const i = this.x;
    const j = this.y;
    // adjacent neighbours
    if (i < cols - 1 && !grid[i + 1][j].wall) {
      this.neighbours.push(grid[i + 1][j]);
    }
    if (i > 0 && !grid[i - 1][j].wall) {
      this.neighbours.push(grid[i - 1][j]);
    }
    if (j < rows - 1 && !grid[i][j + 1].wall) {
      this.neighbours.push(grid[i][j + 1]);
    }
    if (j > 0 && !grid[i][j - 1].wall) {
      this.neighbours.push(grid[i][j - 1]);
    }
    if (diagonals) {
      // diagonal neighbours
      if (i > 0 && j > 0 && !grid[i - 1][j - 1].wall) {
        this.neighbours.push(grid[i - 1][j - 1]);
      }
      if (i < cols - 1 && j > 0 && !grid[i + 1][j - 1].wall) {
        this.neighbours.push(grid[i + 1][j - 1]);
      }
      if (i < cols - 1 && j < rows - 1 && !grid[i + 1][j + 1].wall) {
        this.neighbours.push(grid[i + 1][j + 1]);
      }
      if (i > 0 && j < rows - 1 && !grid[i - 1][j + 1].wall) {
        this.neighbours.push(grid[i - 1][j + 1]);
      }
    }
  }
}

function setup() {
  createCanvas(gridSize, gridSize);

  // populate grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
      grid[i][j].show(color(183, 193, 240));
    }
  }
  console.log("A*", grid);

  //initialize start and goal nodes
  pathStart = grid[0][0];
  pathEnd = grid[cols - 1][rows - 1];
  pathStart.wall = false;
  pathEnd.wall = false;
  pathStart.show(color(123, 20, 123));
  pathEnd.show(color(123, 20, 123));

  // populate neighbours
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  // initalize algo by push
  openSet.push(pathStart);
}

function draw() {
  // algorithm loop
  if (openSet.length > 0) {
    let lowestScoreIndex = 0;
    // get lowest fScore index from all nodes in openSet
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestScoreIndex].f) {
        lowestScoreIndex = i;
      }
    }
    // current variable is the closest node from start
    let current = openSet[lowestScoreIndex];
    //console.log(grid[0][0].neighbours);
    // check if winner is the goal node
    if (openSet[lowestScoreIndex] === pathEnd) {
      noLoop();
      console.log("Done", path);
    }

    // remove current from openSet and add to closedSet
    openSet.splice(lowestScoreIndex, 1);
    closedSet.push(current);

    // evaluate neighbours
    let neighbours = current.neighbours;
    //console.log(current);
    for (let neighbour of neighbours) {
      // skip if neighbour already in closedSet
      if (closedSet.includes(neighbour) || neighbour.wall) {
        continue; // optional: create check flag in object
      }

      // calculate gScore based on distance from current node
      // update gScore if it is lower than an existing score
      // the 1 should be distance from current to neighbour
      let tempG = current.g + heuristic(current, neighbour);
      //console.log(tempG);
      if (tempG < neighbour.g) {
        neighbour.g = tempG;
        // update heuristic score
        neighbour.h = heuristic(neighbour, pathEnd);
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.previous = current;
      }
      // add neighbour to openSet if not in
      if (!openSet.includes(neighbour)) {
        neighbour.h = heuristic(neighbour, pathEnd);
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.previous = current;
        openSet.push(neighbour);
      }
    }

    //draw the path through backtracking
    path = [];
    let node = current;
    path.push(node);
    while (node.previous) {
      path.push(node.previous);
      node = node.previous;
    }

    // colour sets
    for (let i = 0; i < openSet.length; i++) {
      openSet[i].show(color(11, 123, 44));
    }
    for (let i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(174, 3, 84));
    }
    for (let i = 0; i < path.length; i++) {
      path[i].show(color(14, 3, 214));
    }
  } else {
    noLoop();
    console.log("No Solution");
  }
}

// estimate heurstic score via distance
function heuristic(a, b) {
  //   let d = dist(a.x, a.y, b.x, b.y);
  let d = abs(a.x - b.x) + abs(a.y - b.y);
  return d;
}
