/*
 * @class App
 */
class App {
  
  /*
   * @constructs App
   * @param {Object} options
   */
  constructor(state) {
    this.state = state || {};
    console.log('state!!', this.state);
  }

  set(state) {
    this.state = state;
  }

  setProperty(key, value) {
    this.state[key] = value;
  }

  get() {
    return this.state;
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
      }
    }

    return allowableMoves;
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
}

export default App;