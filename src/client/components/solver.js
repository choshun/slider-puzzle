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
  }

  init() {
    console.log('SOLVER INNIT', this);

    this.solve(this.state.grid, this.state.goalGrid, this.state.emptyTile);
  }

  solve(grid, goalGrid, emptyTile) {
    console.log('TOOLS TO SOLVE', grid, goalGrid, emptyTile, 'GRID LOGIC?', this.gridLogic.getAllowableMoves(emptyTile, grid));
    // get fringe with
    // allowable moves
    // then gridLogic.move(emptyTile, tile);
    // then hueristics - generation + rectilinear + tiles out of place
    // TODO - how will I trigger canvas move?
    // compare then repeat
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