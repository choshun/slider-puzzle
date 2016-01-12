/**
 * @class App
 *
 * Bootstraps the puzzle.
 * All DOM bindings and app.state properties
 * should be set here.
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
class App {
  
  /*
   * @constructs App
   *
   * What keeps track of app state/point of truth for app.
   * This also should have shared functions so components
   * don't need to call eachother.
   *
   * @param {Object} state passed in initial state
   */
  constructor(state) {
    this.state = state || {};
  }

  /**
   * Set app state.
   * @param {Object} state state.
   */
  set(state) {
    this.state = state;
  }

  /**
   * Set a property on state.
   * @param {String} key key.
   * @param {String} value value of key.
   */
  setProperty(key, value) {
    this.state[key] = value;
  }

  /**
   * Get app state.
   * @return {Object} this.state app state
   */
  get() {
    return this.state;
  }

  /**
   * Given an empty tile and a grid, return what
   * moves are allowable.
   * ie if the upper-right tile is empty on a 3*3 grid
   * - the 2, 0 coordinate,
   * it will return an array with 2 of
   *  [
   *    [x, y], of tile that can move ie [2, 1],
   *    'direction', ie UP,
   *    tile, ie 5 (counting left to right)
   *  ]
   * @param {Array} emptyTyle x,y of empty tile
   * @param {Array} grid array of coordinates where
   *  the index denotes the original tile ie [1, 1][0, 0]...
   *  original tile 1 will be in the center of a 3*3 grid.
   *
   * @return {Array} allowableMoves an array with arrays of allowable moves.
   */
  getAllowableMoves(emptyTile, grid) {
    var tile,
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

    for (tile = 0; tile < grid.length; tile++) {
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

  /**
   * Returns a direction based on a positive or negative
   * number and axis.
   * @param {Number} offset offset.
   * @param {String} axis axis of offset.
   *
   * @return {String} direction
   */
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
};

export default App;
