/**
 * @class Solver
 *
 * Solves a slider puzzle using the A* algorithm.
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
class Solver {
  /*
   * @constructs Solver
   * @param {Object} state options
   */
  constructor(app, gridLogic) {
    this.app = app;
    this.state = app.state || {};
    this.gridLogic = gridLogic;
    this.solveButton = document.querySelector('.solve-button');
    this.hintButton = document.querySelector('.hint-button');
    this.closedGrids = [];
    this.emptyFringeTile; // TODO: should not be a property
    this.solution = [];
    this.steps = 0; // for testing/bailing after too long
  }

  /**
   * Initializes solver with app.state.
   * @param {Object} state app state
   */
  init(state) {
    this.openGrids = [{
      'grid': state.grid,
      'rank': 0,
      'emptyTile': state.emptyTile,
      'direction': 'none',
      'tileMoved': 'none',
      'tileMovedPosition': 'none',
      'solution': []
    }];
  }

  /**
   * Solves until it's initial grid is goalgrid,
   * or reaches 3000 tries (usually around callstack limit).
   *  I did the grid as an array of arrays:
   *    [0, 0], [0, 1], [0, 2] etc,
   *    are tiles 1, 2, 3 in order on top of grid.
   *    [0, 0], [1, 1], [2, 2]
   *    are tiles 1, 2, 3 making a diagonal.
   *
   * @param {Array} grid candidate grid
   * @param {Array} goalGrid grid we want to get to
   * @param {Array} emptyTile where the empty tile is, ie [0, 0]
   */
  solve(grid, goalGrid, emptyTile) {
    this.steps++;
    // remove leftmost state and assign to candidate
    var candidate = this.openGrids.shift();

    if (this.steps > 3000) {
      this.solution = 'fail';
      console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);
      return;
    }

    if (this.isSameArray(candidate.grid, this.state.goalGrid)) {
      this.solution = candidate.solution;
      console.log('WE DID IT IN ' + candidate.solution.length);
      return;
    }

    // TODO this should be passed explicity
    this.emptyFringeTile = emptyTile;

    var candidates = this.makeFringe(emptyTile, candidate, goalGrid);
    var isOnOpen,
        isOnClosed;

    candidates.forEach((candidate) => {
      isOnClosed = this.closedGrids.some((closedGrid) => {
        return this.isSameArray(candidate.grid, closedGrid.grid);
      });

      isOnOpen = this.openGrids.some((openGrid) => {
        return this.isSameArray(candidate.grid, openGrid.grid);
      });

      // TODO, might be redundant with .every, but it's still so quick
      if (isOnOpen) {
        this._cleanOpenGrids(candidate);
      }
      
      // throws a grid length error
      // if (isOnClosed) {
      //   this._cleanClosedGrids(candidate);
      // }

      // if the candidate is not on openGrids or ClosedGrids...
      // most importantly so we don't do moves we've already done
      if (!isOnOpen && !isOnClosed) {
        this.openGrids.push(candidate);
      }
    });

    // sort by rank
    this.openGrids = this.sort(this.openGrids.slice(), 'rank');

    // move last candidate to closed
    this.closedGrids.push(candidate);
    
    // while openGrids still have stuff
    if (this.openGrids.length !== 0) {
      this.solve(this.openGrids[0].grid, goalGrid, this.openGrids[0].emptyTile);
    }
  }

  /**
   * This is probably the most important function
   * in the app. Returns allowable grids with a bunch of properties
   * I need to compare one grid to another grid
   * Every grid keeps track of it's own path from
   * initial state
   * @param {Array} emptyTile where the empty tile is, ie [0, 0]
   * @param {Object} candidate candidate object, looks like what
   *  we return in a frontier array item
   * @param {Array} goalGrid grid we want to get to
   *
   * @return {Array} frontier array of new candiates.
   */
  makeFringe(emptyTile, candidate, goalGrid) {
    var grid = candidate.grid,
        fringe = this.app.getAllowableMoves(emptyTile, grid),
        rank,
        solution = candidate.solution,
        frontier = [];

    // TODO maybe make whats returned from getAllowable a readable object
    // direction = fringe[1]; is kinda obtuse
    fringe.forEach((item) => {
      var fringed = this.makeFringeGrid(item, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile,
          direction = item[1],
          tileMoved = item[2],
          tileMovedPosition = item[0];

      rank = this.evaluation(fringeGrid, goalGrid, solution.length);

      frontier.push({
        'grid': fringeGrid,
        'rank': rank,
        'emptyTile': emptyTile,
        'direction': direction,
        'tileMoved': tileMoved,
        'tileMovedPosition': tileMovedPosition,
        'solution': this._addPath(tileMovedPosition, tileMoved, direction, solution)
      });
    });

    return frontier;
  }

  /**
   * Takes a candidates path so far and adds to it.
   *
   * @param {Array} tileMovedPosition where it moved from, ie [0, 0]
   * @param {Number} tileMoved what tile is moved
   * @param {String} direction direction tile moved ie 'UP'
   * @param {Array} solution the candidates path so far
   *
   * @return {Array} solution with added path
   */
  _addPath(tileMovedPosition, tileMoved, direction, solution) {
    var tile = [tileMovedPosition[0], tileMovedPosition[1], tileMoved],
        path = {
          'tile': tile,
          'direction': direction
        };

    if (solution.length === 0) {

      return [path];
    } else {
      var solutions = solution.slice();
      solutions.push(path);

      return solutions;
    }
  }

  /**
   * Compares new candidate paths to all open grids paths in hopes of
   * sorting the open grids collection better.
   *
   * @param {Candidate} candidate the candidate
   */
  _cleanOpenGrids(candidate) {
    this.openGrids.forEach((openGrid) => {
      if (this.isSameArray(candidate.grid, openGrid.grid)) {
        if (candidate.solution.length < openGrid.solution.length) {
          // set the opengrid solution to shorter path
          openGrid.solution = candidate.solution;
        }
      }
    });
  }

  /**
   * Compares new candidate paths to all closed grids paths in hopes of
   * finding candidates to put back into open grids.
   *
   * @param {Candidate} candidate the candidate
   */
  _cleanClosedGrids(candidate) {
    this.closedGrids.forEach((closedGrids, index) => {
      if (this.isSameArray(candidate.grid, closedGrids.grid)) {
        if (candidate.solution.length < closedGrids.solution.length) {
          // remove closedgrid from closed and put it on open
          var makeItOpen = this.closedGrids.splice(index, 1);

          this.openGrids.push(makeItOpen);
        }
      }
    });
  }

  /**
   * Checks if two arrays have the same values.
   *
   * @param {Array} grid grid
   * @param {Array} targetGrid targetGrid you're comparing to
   *
   * @return {Boolean}
   */
  isSameArray(grid, targetGrid) {
    return (grid.length === targetGrid.length) && grid.every((element, index) => {
      return element === targetGrid[index]; 
    });
  }

  /**
   * Returns a best guess underestimate of "closeness"
   * of a grid to another grid "goal grid".
   *
   * @param {Array} grid grid
   * @param {Array} goalGrid goalGrid
   * @param {Number} generation how many moves a candidate has made
   *
   * @return {Number}
   */
  evaluation(grid, goalGrid, generation) {
    return this._getDistance(grid, goalGrid) + generation;
  }

  /**
   * Returns distance of each tile to goal tile, plus
   * which tiles don't match goal tile.
   *
   * @param {Array} grid grid
   * @param {Array} goalGrid goalGrid
   * @param {Number} generation how many moves a candidate has made
   *
   * @return {Number} totalDistance
   */
  _getDistance(grid, goalGrid) {
    var totalDistance = 0,
        distance;

    grid.forEach((tile, index) => {
      distance = (Math.abs(tile[0] - goalGrid[index][0]) + Math.abs(tile[1] - goalGrid[index][1]));
      
      // quick check for another hueristic, 
      // if the tile is identical to goalgrid tile
      if (distance !== 0) {
        totalDistance += 1;
      }

      totalDistance += distance;
    });

    return totalDistance;
  }

  /**
   * Produces a grid for an allowable move.
   *
   * @param {Array} fringe allowable move (see app.getAllowableMoves)
   * @param {Array} goalGrid goalGrid
   * @param {Array} emptyTile where the empty tile is, ie [0, 0]
   *
   * @return {Object} updated grid
   */
  makeFringeGrid(fringe, grid, emptyTile) {
    var tile = fringe[2];

    var fromPosition = grid[tile];
    grid[tile] = emptyTile;

    return {
      'grid': grid,
      'emptyTile': fromPosition
    };
  }

  /**
   * Sorts an array by key lowest first.
   *
   * @param {Array} array array to sort
   * @param {String} key key to sort by
   *
   * @return {Array} sorted array by key
   */
  sort(array, key) {
    return array.sort((a, b) => {
      return a[key] - b[key];
    });
  }
}

export default Solver;
