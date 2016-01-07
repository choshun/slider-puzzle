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
    this.openGrids = [];
    // keeps track of states already visited
    this.closedGrids = [];
    this.emptyFringeTile;

    // for testing
    this.steps = 0;
  }

  init() {
    this.solve(this.state.grid, this.state.goalGrid, this.state.emptyTile);
  }

  solve(grid, goalGrid, emptyTile) {
    this.steps++;

    if (this.steps > 100) {
      // console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);

      return;
    }

    // console.log('EMPTY?', emptyTile);

    // console.log('GRID PREARED FOR IS SAME', grid);

    if (this._isSameArray(grid, this.state.goalGrid)) {
      console.log('WE DID IT IN ' + this.steps);

      return;
    }

    this.emptyFringeTile = emptyTile;

    // TODO!!! am assigning an array, when I should push items

    this.openGrids = this.makeFringe(emptyTile, grid, goalGrid);

    // THIS DUN WORK
    this.generation++;

    this.openGrids = this._order(this.openGrids, 'rank');
    
    // TODO: I might need moves made in number, and actual "moves" made to solve in object
    // once I have winning object we're good, don't need nothing else.
    
    // console.log('OPEN GRIDS', this.openGrids);

    this.solve(this.openGrids[0].grid, goalGrid, this.openGrids[0].emptyTile);

    // this.openGrids.forEach((candidate, index) => {
    //   console.log('grids to sove?', candidate);

    //   this.solve(candidate[1], this.state.goalGrid, candidate[0]);
    //   // this.closedGrids.push(this.openGrids.shift()); 
      
    //   console.log('SHIFT!'); 
    // });
  }

  // @TODO!!! just make children, pass in move and increment by one, maybe have it in object
  // DO NOT assign rank yet, just make children states,
  // so I can compare child state with moves to state

  // DO NOT loop through everything, trust the queue, just make fucking children here
  // need to make path a string to compare, with a length, an array I guess, use isSameArray
  makeFringe(emptyTile, grid, goalGrid) {
    var fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank,
        frontier = [];

    fringe.forEach((fringe, index) => {
      // TODO a bit not dry with the gridLogic shuffle move thing
      var fringed = this._makeGrid(fringe, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile;

      // console.log(fringed, fringeGrid, emptyTile);

      rank = this._evaluation(fringeGrid, goalGrid, this.generation);



      frontier.push({
        'grid': fringeGrid,
        'rank': rank,
        'emptyTile': emptyTile
      });
    });

    console.log('FRINGE', frontier);

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