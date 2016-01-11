/*
 * @class Solver
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

  init(state) {
    this.openGrids = [{
      'grid': state.grid,
      'rank': 0,
      'emptyTile': state.emptyTile,
      'direction': 'none', // TODO: hope this doesn't break it
      'tileMoved': 'none',
      'tileMovedPosition': 'none',
      'solution': []
    }];
  }

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

  isSameArray(grid, targetGrid) {
    return (grid.length === targetGrid.length) && grid.every((element, index) => {
      return element === targetGrid[index]; 
    });
  }

  // returns a best guess underestimate of "closeness",
  // of a grid to another grid "goal grid"
  evaluation(grid, goalGrid, generation) {
    return this._getDistance(grid, goalGrid) + generation;
  }

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

  makeFringeGrid(fringe, grid, emptyTile) {
    var tile = fringe[2];

    var fromPosition = grid[tile];
    grid[tile] = emptyTile;

    return {
      'grid': grid,
      'emptyTile': fromPosition
    };
  }

  sort(array, key) {
    return array.sort((a, b) => {
      return a[key] - b[key];
    });
  }
}

export default Solver;