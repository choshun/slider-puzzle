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
 * @class Canvas
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
    // current new candidates for moving,
    // ordered left best to right worst according to the 
    // evaluation function estimate
    // this.openGrids = [];
    // keeps track of states already visited
    this.closedGrids = [];
    this.emptyFringeTile; // TODO: should not be a property
    this.solution = [];
    this.candidate,
    this.candidates;

    console.log('solver state at init?', this.state);

    // assign starting grid to open grids

    // for testing
    this.steps = 0;
  }

  init(state) {
    this.openGrids = [{
      'grid': state.grid,
      'rank': this._evaluation(state.grid, state.goalGrid, this.generation),
      'emptyTile': state.emptyTile,
      'direction': 'none', // TODO: hope this doesn't break it
      'tileMoved': 'none',
      'tileMovedPosition': 'none'
    }];

    console.log('INIT openGrids', this.openGrids);
    // this.solve(this.state.grid, this.state.goalGrid, this.state.emptyTile);
  }

  solve(grid, goalGrid, emptyTile) {
    this.steps++; // really needs to be internal to object, especially if we find a faster path

    // remove leftmost state and assign to candidate
    // console.log('OPEN GRID AT START', this.openGrids);

    this.candidate = this.openGrids.shift();

    if (this.steps > 1000) {
      // console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);
      // this.solution = undefined;

      return;
    }

    // console.log('GRID PREARED FOR IS SAME', grid);

    if (this._isSameArray(this.candidate.grid, this.state.goalGrid)) {
      console.log('WE DID IT IN ' + this.steps, this.solution.length);

      return;
    }

    // TODO this should be passed explicity
    this.emptyFringeTile = emptyTile;

    this.candidates = this.makeFringe(emptyTile, this.candidate.grid, goalGrid);

    var isOnOpen,
        isOnClosed;
    
    this.candidates.forEach((candidate) => {

      // is in open
      isOnOpen = this.openGrids.some((openGrid) => {
        return this._isSameArray(candidate.grid, openGrid.grid);
      });

      // is in closed
      isOnClosed = this.closedGrids.some((closedGrid) => {
        return this._isSameArray(candidate.grid, closedGrid.grid);
      });

      // if the candidate is not on openGrids or ClosedGrids
      if (!isOnOpen && !isOnClosed) {
        this.openGrids.push(candidate);
        
      }

      // TODO, seems redundant
      if (isOnClosed) {
        // this.openGrids.push(candidate);
        // this.openGrids = this._order(this.openGrids, 'rank').slice(1);
      }
    });

    this.openGrids = this._order(this.openGrids, 'rank');

    // TODO!!!: THIS DUN WORK
    this.generation++;

    // TODO!!!: isOnopen...

    // TODO!!!: isonclosed...

    this.closedGrids.push(this.candidate);
    
    // TODO: I might need moves made in number, and actual "moves" made to solve in object
    // once I have winning object we're good, don't need nothing else.
    
    // console.log('OPEN GRIDS', this.openGrids);

    // for now just best ranked, doesn't consider equal ranked ones
    // AND WE MOVE ON!
    
    // TODO!!! this should prolly be assigned in openGrid object, and not exposed 
    // until it's solved
    // when solved say this.solution this.candidate.solution
    var tile = [this.openGrids[0].tileMovedPosition[0], this.openGrids[0].tileMovedPosition[1], this.openGrids[0].tileMoved];

    // console.log('TILE?', tile, this.openGrids[0].tileMovedPosition[0], this.openGrids[0].tileMovedPosition[1], this.openGrids[0].tileMoved);

    this.solution.push({
      'tile': tile,
      'direction': this.openGrids[0].direction
    });

    // console.log('SOLUTION', this.solution);

    // while openGrids still have stuff
    if (this.openGrids.length !== 0) {
      this.solve(this.openGrids[0].grid, goalGrid, this.openGrids[0].emptyTile);
    }
  }

  makeFringe(emptyTile, grid, goalGrid) {
    var fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank,
        frontier = [];

    // TODO maybe make whats returned from getAllowable a readable object
    // direction = fringe[1]; is kinda obtuse
    fringe.forEach((fringe, index) => {
      // TODO a bit not dry with the gridLogic shuffle move thing
      var fringed = this._makeGrid(fringe, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile,
          direction = fringe[1],
          tileMoved = fringe[2],
          tileMovedPosition = fringe[0];

      // console.log(fringed, fringeGrid, emptyTile);

      rank = this._evaluation(fringeGrid, goalGrid, this.generation);

      frontier.push({
        'grid': fringeGrid,
        'rank': rank,
        'emptyTile': emptyTile,
        'direction': direction,
        'tileMoved': tileMoved,
        'tileMovedPosition': tileMovedPosition
      });
    });

    // console.log('FRINGE', frontier);

    return frontier;
  }

  _isSameArray(grid, targetGrid) {
    // console.log('GRID?', grid, 'TARGET?', targetGrid);
    return (grid.length === targetGrid.length) && grid.every((element, index) => {
      return element === targetGrid[index]; 
    });
  }

  // returns a best guess underestimate of "closeness",
  // of a grid to another grid "goal grid"
  _evaluation(grid, goalGrid, generation) {
    // console.log('evaluation?', grid, goalGrid, generation);

    return this._getDistance(grid, goalGrid) + generation;
  }

  _getDistance(grid, goalGrid) {
    var totalDistance = 0,
        distance;

    grid.forEach((tile, index) => {
      distance = (Math.abs(tile[0] - goalGrid[index][0]) + Math.abs(tile[1] - goalGrid[index][1]));
      
      // quick check for another hueristic, all values are identical :(
      if (distance !== 0) {
        totalDistance += 1;
      }

      totalDistance += distance;
      // console.log('in grid array', tile, goalGrid[index], index, distance);
    });

    return totalDistance;
  }

  // TODO should either be global or in gridLogic
  _makeGrid(fringe, grid, emptyTile) {
    var tile = fringe[2];

    // console.log('WHY UNDEFINED?', fringe, emptyTile);

    var fromPosition = grid[tile];
    grid[tile] = emptyTile;
    // emptyTile = fromPosition;
    // console.log('FRINGED!', fringe);
    // console.log(tile, grid, emptyTile);

    return {
      'grid': grid,
      'emptyTile': fromPosition
    };
  }

  _order(array, key) {
    return array.sort((a, b) => {
      return a[key] - b[key]
    });
  }
}

export default Solver;