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
    this.fringeGrids = []; // 
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
      console.log('sad trombone', this.fringeGrids);

      return;
    }

    // console.log('EMPTY?', emptyTile);

    if (this._isSameArray(grid, goalGrid)) {
      console.log('WE DID IT IN ' + this.steps);

      return;
    }

    this.emptyFringeTile = emptyTile;

    var fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank;
      
    fringe.forEach((fringe, index) => {  
      // TODO a bit not dry with the gridLogic shuffle move thing
      var fringed = this._makeGrid(fringe, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile;

      // console.log(fringed, fringeGrid, emptyTile);

      rank = this._algorithm(fringeGrid, goalGrid, this.generation);

      this.fringeGrids.push({
        'grid': fringeGrid,
        'rank': rank,
        'emptyTile': emptyTile
      });

      console.log('RANK', rank);
      // console.log('RANK', rank, this.fringeGrids); 
    });



    this.generation++;

    var ordered = this._order(this.fringeGrids, 'rank');
    
    console.log('WINNER', ordered[0].rank);

    // console.log('ordered!', ordered);

    // get fringe with
    // allowable moves
    // then gridLogic.move(emptyTile, tile), actually move internally, no need to touch DOM
    // then hueristics - generation + rectilinear + tiles out of place
    // TODO - how will I trigger canvas move? .. you wont! 
    // compare then repeat

    /*
      what's a good object for this,
      I need
      emptyTile, 
      grid,
      rank
    */

    this.solve(ordered[0].grid, goalGrid, ordered[0].emptyTile);
  }

  _isSameArray(array1, array2) {
    return (array1.length == array2.length) && array1.every((element, index) => {
      return element === array2[index]; 
    });
  }

  _algorithm(grid, goalGrid, generation) {
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