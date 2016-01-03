/*
 * @class GridLogic
 * Responsible for setting up the grid, and maintaining it
 */
class GridLogic {

  /*
   * @constructs GridLogic
   * @param {Object} options
   */
  constructor(globalState) {
    this.globalState = globalState || {};
    this.state = globalState.state || {};

    this.gridSize = this.state.gridSize || {};
    this.goalGrid;
    this.shuffledGrid;

    // assume emptyTile is the last tile.
    this.emptyTile = [this.gridSize - 1, this.gridSize - 1];
    this.allowableMoves;
    this.shuffleMoves;
    this.lastDirection;
  }

  init() {
    this.goalGrid = this._createGrid(this.gridSize);
    this.shuffledGrid = this._shuffle(this.goalGrid.slice(), this.state.shuffleTimes);
  }

  _createGrid(gridSize) {
    var i,
        j,
        grid = [];

    for (i = 0; i < gridSize; i++) {
      for (j = 0; j < gridSize; j++) {
        grid.push([j, i]);
      }
    }

    // make last tile empty
    grid.pop();

    return grid;
  }

  _shuffle(grid, times) {
    var i = 0,
        n = times;

    for (; i < n; i++) {
      // get next allowable moves
      this.allowableMoves = this.getAllowableMoves(this.emptyTile, grid);

      // console.log('ALLOWABLE', this.allowableMoves);

      // randomly choose an allowable move
      grid = this._moveToRandomTile(grid, this.allowableMoves);
    }

    return grid;
  }

  getAllowableMoves(emptyTile, grid) {
    var tile = 0,
        n = grid.length,
        allowableMoves = [];

    var emptyCol = emptyTile[0],
        emptyRow = emptyTile[1],
        gridRow,
        gridCol,
        oneColAway,
        oneRowAway,
        direction,
        horizontalOffset,
        verticleOffset;

    for (;tile < n; tile++) {
      gridCol = grid[tile][0];
      gridRow = grid[tile][1];
      horizontalOffset = gridCol - emptyCol;
      verticleOffset = gridRow - emptyRow;

      // if the tile is on same row, and one col away
      oneColAway = (emptyRow === gridRow && Math.abs(horizontalOffset) === 1);
      // if the tile is on col row, and one row away
      oneRowAway = (emptyCol === gridCol && Math.abs(verticleOffset) === 1);

      if (oneColAway || oneRowAway) {
        if (oneColAway) {
          direction = this.getDirection(horizontalOffset, 'x');
        }

        if (oneRowAway) {
          direction = this.getDirection(verticleOffset, 'y');
        }
        
        allowableMoves.push([grid[tile], direction, tile]);


        // TODO: this should ONLY be used on init shuffle, need it, it helps quite a bit :(
        // if we just moved left, we don't want to move right
        // if (direction !== this.getOppositeDirection()[this.lastDirection]) {
        //   // push to fringe
        //   allowableMoves.push([grid[tile], direction, tile]);
        // }
      }
    }

    return allowableMoves;
  }

  _moveToRandomTile(grid, allowableMoves) {
    var choice = allowableMoves[Math.floor(Math.random() * allowableMoves.length)],
        direction = choice[1], 
        tile = choice[2],
        fromPosition = grid[tile];

    // console.log('CHOICE?', choice);

    // console.log('TILE?', tile);

    // console.log('DIRECTION?', direction);

    // keep track so we don't move back and cancel
    // last move
    this.lastDirection = direction;

    // switch emptyTile and moved tile [x, y]
    grid[tile] = this.emptyTile;
    this.emptyTile = fromPosition;

    // console.log('EMPTY?', this.emptyTile);

    return grid;
  }

  getDirection(offset, axis) {
    var direction;

    if (axis === 'y') {
      if (offset === -1) {
        direction = 'DOWN';
      } else {
        direction = 'UP';
      }
    } else if (axis === 'x') {
      if (offset === -1) {
        direction = 'RIGHT';
      } else {
        direction = 'LEFT';
      }
    }

    return direction;
  }

  getOppositeDirection() {
    return {
      'LEFT': 'RIGHT',
      'UP': 'DOWN',
      'RIGHT': 'LEFT',
      'DOWN': 'UP'
    };
  }
}

export default GridLogic;