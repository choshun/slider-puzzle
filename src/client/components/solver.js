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

    if (this.steps > 3) {
      // console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);

      return;
    }

    // console.log('EMPTY?', emptyTile);

    if (this._isSameArray(grid, goalGrid)) {
      console.log('WE DID IT IN ' + this.steps);

      return;
    }

    this.emptyFringeTile = emptyTile;

    this._makeFringe(emptyTile, grid, goalGrid);

    // START GET FRINGE AND ADD TO OPEN
    // var fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
    //     rank;

    // fringe.forEach((fringe, index) => {
    //   // TODO a bit not dry with the gridLogic shuffle move thing
    //   var fringed = this._makeGrid(fringe, grid.slice(), this.emptyFringeTile),
    //       fringeGrid = fringed.grid,
    //       emptyTile = fringed.emptyTile;

    //   // console.log(fringed, fringeGrid, emptyTile);

    //   rank = this._evaluation(fringeGrid, goalGrid, this.generation);

    //   // should be this.
    //   this.openGrids.push({
    //     'grid': fringeGrid,
    //     'rank': rank,
    //     'emptyTile': emptyTile
    //   });

    //   // console.log('PUSH!');

    //   // console.log('RANK', rank);
    //   // console.log('RANK', rank, this.openGrids); 
    // });
    // END GET FRINGE AND ADD TO OPEN

    // THIS DUN WORK
    this.generation++;

    this.openGrids = this._order(this.openGrids, 'rank');
    
    // console.log('OPEN GRIDS', this.openGrids);

    // console.log('WINNER', ordered[0].rank);

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

    // if (this.generation < 4) {
    //   this.openGrids.forEach((grid, index) => {
        
    // console.log('OPEN', this.openGrids, 'CLOSED', this.closedGrids);

    //     //
    //   });
    // }


    // TODO: solve all the numbers that equal a lower bound
    // generation needs to stay the same for sibling trees

    // TODO: I might need moves made in number, and actual "moves" made to solve in object
    // once I have winning object we're good, don't need nothing else.
    
    //var lowest = this._getLowestRanks(this.openGrids, goalGrid);
    
    //console.log('LOWEST', lowest);

    // lowest.forEach((grid, index) => {
    //   console.log('I SUCK');
    //   this.solve(grid, goalGrid, grid.emptyTile);
    // });
    
    console.log('OPEN GRIDS', this.openGrids);

    this.openGrids.forEach((grid) => {
      this.solve(grid.grid, goalGrid, grid.emptyTile);
      this.closedGrids.push(this.openGrids.shift()); 
      
      console.log('SHIFT!'); 
    });
  }

  // @TODO!!! just make children, pass in move and increment by one, maybe have it in object
  // DO NOT assign rank yet, just make children states,
  // so I can compare child state with moves to state

  // DO NOT loop through everything, trust the queue, just make fucking children here
  // need to make path a string to compare, with a length, an array I guess, use isSameArray
  _makeFringe(emptyTile, grid, goalGrid) {
    var fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank;

    fringe.forEach((fringe, index) => {
      // TODO a bit not dry with the gridLogic shuffle move thing
      var fringed = this._makeGrid(fringe, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile;

      // console.log(fringed, fringeGrid, emptyTile);

      rank = this._evaluation(fringeGrid, goalGrid, this.generation);

      // should be this.
      this.openGrids.push({
        'grid': fringeGrid,
        'rank': rank,
        'emptyTile': emptyTile
      });

      // console.log('PUSH!');

      // console.log('RANK', rank);
      // console.log('RANK', rank, this.openGrids); 
    });
  }

  _getLowestRanks(grids, goalGrid) {
    var lowestRank = grids[0].rank;

    var candidates = [];

    console.log('LOWEST RANK', lowestRank, grids);

    grids.forEach((grid, index) => {
      // console.log('GRID RANK', grid.rank);

      if (grid.rank === lowestRank) {
        // this.openGrids.push(grid);
        // console.log('same rank');
        candidates.push(grid);
        
        // console.log('CANDIDATES', candidates);

        //this.solve(candidates[index].grid, goalGrid, candidates[index].emptyTile);

      } else {
        // this.openGrids.push(grid);
        // this.solve(candidates[0].grid, goalGrid, candidates[0].emptyTile);
      }

      

      // console.log('UNIQUE RANK?', grid.rank);
      // console.log('boop');
    });

    this.generation++;

    return candidates;
    // this.openGrids = this._order(this.openGrids, 'rank');
  }

  _isSameArray(array1, array2) {
    return (array1.length === array2.length) && array1.every((element, index) => {
      return element === array2[index]; 
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