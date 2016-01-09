/*
  Solves puzzle
  Gives hints
*/

/*
  f(n) = g(n) + h(n)
  
  where
  f(n) is the assigned rank
  g(n) is generation
  h(n) is the distance between the tile location and goal 
*/
/*
 * @class Solver
 */
class Solver {

  // TODO!!! empty tile isn't being set correctly sometimes, especially with hard to solve ones
  // prolly has to do with adding every move to solution (reordered solutions may have different emptyTiles)
  /*
   * @constructs Canvas
   * @param {Object} state options
   */
  constructor(globalState, gridLogic) {
    this.globalState = globalState;
    this.state = globalState.state || {};
    this.gridLogic = gridLogic;
    this.generation = 0;
    this.solveButton = document.querySelector('.solve-button');
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
      console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);

      return;
    }

    if (this._isSameArray(candidate.grid, this.state.goalGrid)) {
      this.solution = candidate.solution;
      console.log('WE DID IT IN ' + candidate.solution.length);

      return;
    }

    // TODO this should be passed explicity
    this.emptyFringeTile = emptyTile;

    var candidates = this.makeFringe(emptyTile, candidate, goalGrid);
    var isOnOpen,
        isOnClosed;

    var paths = [];

    candidates.forEach((candidate) => {

      // is in open flag
      isOnOpen = this.openGrids.some((openGrid) => {
        return this._isSameArray(candidate.grid, openGrid.grid);
      });

      // is in closed flag
      isOnClosed = this.closedGrids.some((closedGrid) => {
        return this._isSameArray(candidate.grid, closedGrid.grid);
      });

      // if the candidate is not on openGrids or ClosedGrids
      // most importantly so we don't do moves already on closed
      if (!isOnOpen && !isOnClosed) {
        this.openGrids.push(candidate);
      }
      
      // TODO, seems redundant
      if (isOnClosed) {
        // this.openGrids.push(candidate);
        // this.openGrids = this._sort(this.openGrids, 'rank').slice(1);
      }
    });

    // sort by rank
    this.openGrids = this._sort(this.openGrids.slice(), 'rank');
    
    // TODO!!!: Pass in frontier based on solution steps
    this.generation++;

    // move last candidate to closed
    this.closedGrids.push(candidate);
    
    // while openGrids still have stuff
    if (this.openGrids.length !== 0) {
      this.solve(this.openGrids[0].grid, goalGrid, this.openGrids[0].emptyTile);
    }
  }

  makeFringe(emptyTile, candidate, goalGrid) {
    var grid = candidate.grid,
        fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank,
        solution = candidate.solution,
        frontier = [];

    // TODO maybe make whats returned from getAllowable a readable object
    // direction = fringe[1]; is kinda obtuse
    fringe.forEach((item) => {
      var fringed = this._makeGrid(item, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile,
          direction = item[1],
          tileMoved = item[2],
          tileMovedPosition = item[0];

      rank = this._evaluation(fringeGrid, goalGrid, solution.length);

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

  _isSameArray(grid, targetGrid) {
    return (grid.length === targetGrid.length) && grid.every((element, index) => {
      return element === targetGrid[index]; 
    });
  }

  // returns a best guess underestimate of "closeness",
  // of a grid to another grid "goal grid"
  _evaluation(grid, goalGrid, generation) {
    return this._getDistance(grid, goalGrid) + generation;
  }

  _getDistance(grid, goalGrid) {
    var totalDistance = 0,
        distance;

    grid.forEach((tile, index) => {
      distance = (Math.abs(tile[0] - goalGrid[index][0]) + Math.abs(tile[1] - goalGrid[index][1]));
      
      // quick check for another hueristic, 
      // if all tile is identical to goalgrid tile
      if (distance !== 0) {
        totalDistance += 1;
      }

      totalDistance += distance;
    });

    return totalDistance;
  }

  // TODO should either be global or in gridLogic
  _makeGrid(fringe, grid, emptyTile) {
    var tile = fringe[2];

    var fromPosition = grid[tile];
    grid[tile] = emptyTile;

    return {
      'grid': grid,
      'emptyTile': fromPosition
    };
  }

  _sort(array, key) {
    return array.sort((a, b) => {
      return a[key] - b[key]
    });
  }
}

export default Solver;