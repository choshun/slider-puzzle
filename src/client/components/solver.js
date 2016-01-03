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
  }

  init() {
    this.solve(this.state.grid, this.state.goalGrid, this.state.emptyTile);
  }

  solve(grid, goalGrid, emptyTile) {
    if (this._isSameArray(grid, goalGrid)) {
      console.log('WE DID IT');

      return;
    }

    var fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank;
    
    fringe.forEach((fringe, index) => {
      // TODO a bit not dry with the gridLogic shuffle move thing
      var fringeGrid = this._makeGrid(fringe, grid.slice(), emptyTile);

      this.fringeGrids.push(fringeGrid);

      rank = this._algorithm(fringeGrid, goalGrid, this.generation);

      console.log('RANK', rank); 
    });

    this.generation++;

    // get fringe with
    // allowable moves
    // then gridLogic.move(emptyTile, tile), actually move internally, no need to touch DOM
    // then hueristics - generation + rectilinear + tiles out of place
    // TODO - how will I trigger canvas move?
    // compare then repeat
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
      totalDistance += distance;
      console.log('in grid array', tile, goalGrid[index], index, distance);
    });

    return totalDistance;
  }

  // TODO should either be global or in gridLogic
  _makeGrid(fringe, grid, emptyTile) {
    var tile = fringe[2];
    grid[tile] = emptyTile;

    console.log('FRINGED!', fringe);
    // console.log(tile, grid, emptyTile);

    return grid;
  }
}


var generation = 0;

function getGeneration() {
  return generation;
}

// function getDistance() {
//   var origCol, 
//       origRow, 
//       _ref;

//   _ref = originalPosition(num);
//   origRow = _ref[0];
//   origCol = _ref[1];
  
//   return Math.abs(origRow - curRow) + Math.abs(origCol - curCol);
// }

//after loop
generation++;

export default Solver;