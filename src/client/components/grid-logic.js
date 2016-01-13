/**
 * @class GridLogic
 *
 * Handles setting up and shuffling initial grid object
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
class GridLogic {

  /*
   * @constructs GridLogic
   * @param {Object} options
   */
  constructor() {
    this.app;
    this.gridSize;
    this.goalGrid;
    this.shuffledGrid;
    this.emptyTile;
    this.allowableMoves;
    this.shuffleMoves;
    this.lastDirection;
    this.retryButton;
  }

  /**
   * Bootstraps canvas.
   * @param {Object} app global app.
   */
  init(app) {
    this.app = app || {};
    this.gridSize = app.state.gridSize || {};
    this.retryButton = document.querySelector('footer')
        .querySelector('.retry-button');

    // assume emptyTile is the last tile.
    this.emptyTile = [this.gridSize - 1, this.gridSize - 1];
    this.goalGrid = this._createGrid(this.gridSize);
    this.shuffledGrid = this._shuffle(this.goalGrid.slice(),
        app.state.shuffleTimes);
  }

  /**
   * Creates a grid with an empty tile.
   * @param {Number} gridSize size of puzzle.
   */
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

  /**
   * Shuffles a grid.
   * @param {Array} grid grid
   * @param {Number} times times to shuffle (random)
   *
   * @return {Array} grid grid
   */
  _shuffle(grid, times) {
    var i = 0,
        n = times;

    for (; i < n; i++) {
      // get next allowable moves
      this.allowableMoves = this.app.getAllowableMoves(this.emptyTile, grid);

      // randomly choose an allowable move
      grid = this._moveToRandomTile(grid, this.allowableMoves);
    }

    return grid;
  }

  /**
   * When shuffling it'll move grid tiles
   * to a random allowable grid.
   * @param {Array} grid grid
   * @param {Array} allowableMoves allowable moves
   *  (see app.getAllowableMoves)
   *
   * @return {Array} grid grid
   */
  _moveToRandomTile(grid, allowableMoves) {
    var choice = allowableMoves[Math.floor(Math.random() *
            allowableMoves.length)],
        direction = choice[1],
        tile = choice[2],
        fromPosition = grid[tile];

    this.lastDirection = direction;

    // switch emptyTile and moved tile [x, y]
    grid[tile] = this.emptyTile;
    this.emptyTile = fromPosition;

    return grid;
  }
};

export default GridLogic;
