import { Node, DiagonalMovement } from "pathfinding";

export class Grid {
  constructor(width_or_matrix, height, matrix) {
    let width;

    if (typeof width_or_matrix !== 'object') {
      width = width_or_matrix;
    } else {
      height = width_or_matrix.length;
      width = width_or_matrix[0].length;
      matrix = width_or_matrix;
    }

    this.width = width;
    this.height = height;
    this.nodes = this._buildNodes(width, height, matrix);
  }

  _buildNodes = (width, height, matrix) => {
    var i, j,
      nodes = new Array(height);

    for (i = 0; i < height; ++i) {
      nodes[i] = new Array(width);
      for (j = 0; j < width; ++j) {
        nodes[i][j] = new Node(j, i);
      }
    }


    if (matrix === undefined) {
      return nodes;
    }

    if (matrix.length !== height || matrix[0].length !== width) {
      throw new Error('Matrix size does not fit');
    }

    for (i = 0; i < height; ++i) {
      for (j = 0; j < width; ++j) {
        if (matrix[i][j]) {
          nodes[i][j].walkable = false;
        }
      }
    }

    return nodes;
  };


  getNodeAt = (x, y) => {
    return this.nodes[y] && this.nodes[y][x] ? this.nodes[y][x] : {};
  };

  isWalkableAt = (x, y) => {
    return this.isInside(x, y) && this.nodes[y][x].walkable;
  };

  isInside = (x, y) => {
    return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
  };

  setWalkableAt = (x, y, walkable) => {
    this.nodes[y][x].walkable = walkable;
  };

  getNeighbors = (node, diagonalMovement) => {
    let x = node.x,
      y = node.y,
      neighbors = [],
      s0 = false, d0 = false,
      s1 = false, d1 = false,
      s2 = false, d2 = false,
      s3 = false, d3 = false,
      nodes = this.nodes;

    // ↑
    if (this.isWalkableAt(x, y - 1)) {
      neighbors.push(nodes[y - 1][x]);
      s0 = true;
    }
    // →
    if (this.isWalkableAt(x + 1, y)) {
      neighbors.push(nodes[y][x + 1]);
      s1 = true;
    }
    // ↓
    if (this.isWalkableAt(x, y + 1)) {
      neighbors.push(nodes[y + 1][x]);
      s2 = true;
    }
    // ←
    if (this.isWalkableAt(x - 1, y)) {
      neighbors.push(nodes[y][x - 1]);
      s3 = true;
    }

    if (diagonalMovement === DiagonalMovement.Never) {
      return neighbors;
    }

    if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
      d0 = s3 && s0;
      d1 = s0 && s1;
      d2 = s1 && s2;
      d3 = s2 && s3;
    } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
      d0 = s3 || s0;
      d1 = s0 || s1;
      d2 = s1 || s2;
      d3 = s2 || s3;
    } else if (diagonalMovement === DiagonalMovement.Always) {
      d0 = true;
      d1 = true;
      d2 = true;
      d3 = true;
    } else {
      throw new Error('Incorrect value of diagonalMovement');
    }

    // ↖
    if (d0 && this.isWalkableAt(x - 1, y - 1)) {
      neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (d1 && this.isWalkableAt(x + 1, y - 1)) {
      neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (d2 && this.isWalkableAt(x + 1, y + 1)) {
      neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (d3 && this.isWalkableAt(x - 1, y + 1)) {
      neighbors.push(nodes[y + 1][x - 1]);
    }

    return neighbors;
  };


  clone = () => {
    let i, j,
      width = this.width,
      height = this.height,
      thisNodes = this.nodes,

      newGrid = new Grid(width, height),
      newNodes = new Array(height);

    for (i = 0; i < height; ++i) {
      newNodes[i] = new Array(width);
      for (j = 0; j < width; ++j) {
        newNodes[i][j] = new Node(j, i, thisNodes[i][j].walkable);
      }
    }

    newGrid.nodes = newNodes;

    return newGrid;
  };
}
