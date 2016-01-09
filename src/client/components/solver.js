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
    // this.candidate, // TODO: maybe not be a property
    // this.candidates, // TODO: maybe not be a property
    // this.solutions = {}; // TODO: maybe not be a property

    // console.log('solver state at init?', this.state);

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
      'tileMovedPosition': 'none',
      'solution': []
    }];

    // console.log('INIT openGrids', this.openGrids);
    // this.solve(this.state.grid, this.state.goalGrid, this.state.emptyTile);
  }

  // TODO!!! I have to pass frontier to append to solution :(
  solve(grid, goalGrid, emptyTile, frontier) {
    this.steps++; // really needs to be internal to object, especially if we find a faster path

    // remove leftmost state and assign to candidate
    // console.log('OPEN GRID AT START', this.openGrids);

    var candidate = this.openGrids.shift();
    var currentPath = candidate.solution;
        // thisPath = currentPath.length;

    if (this.steps > 300) {
      // console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);
      // this.solution = undefined;

      return;
    }

    // console.log('GRID PREARED FOR IS SAME', grid);

    if (this._isSameArray(candidate.grid, this.state.goalGrid)) {
      console.log('WE DID IT IN ' + candidate.solution.length);

      this.solution = candidate.solution;

      return;
    }

    // TODO this should be passed explicity
    this.emptyFringeTile = emptyTile;

    // DON'T assign frontier until I have solution
    // if so, how do I assign solution to previous tile solutions?
    // A: by making sure openTiles (candidate = openTiles.shift) has frontier (and maybe generation) before I evaluate it
    // ERRY TILE HAS A SOLUTION


    var candidates = this.makeFringe(emptyTile, candidate, goalGrid);

    var isOnOpen,
        isOnClosed;
    
    // console.log('BEFORE forEach');

    var paths = [];

    candidates.forEach((candidate) => {

      // // is in open
      isOnOpen = this.openGrids.some((openGrid) => {
        return this._isSameArray(candidate.grid, openGrid.grid);
      });

      // is in closed
      isOnClosed = this.closedGrids.some((closedGrid) => {
        return this._isSameArray(candidate.grid, closedGrid.grid);
      });

      // // if the candidate is not on openGrids or ClosedGrids
      if (!isOnOpen && !isOnClosed) {

        var tile = [candidate.tileMovedPosition[0], candidate.tileMovedPosition[1], candidate.tileMoved];

        // console.log('CANDIDATE UNIQUE?', candidate);

        // console.log('Current path at start?', currentPath, thisPath);

        paths.push({
          'tile': tile,
          'direction': candidate.direction
        });

        // currentPath[thisPath] = {
        //   'tile': tile,
        //   'direction': candidate.direction
        // };



        // console.log('Current path at assignment?', currentPath[thisPath]);

        // console.log('DIRETION?', candidate.direction, 'length?', thisPath, currentPath[thisPath]);

        // candidate.solution = currentPath;

        // candidate.solution.push({
        //   'tile': tile,
        //   'direction': candidate.direction
        // });

        // console.log('CURRENT PATH?', currentPath, currentPath[thisPath]);

        // this.openGrids.push(candidate);

        // console.log('good right?', this.openGrids);
      }

      // console.log('mangled yet?', this.openGrids);

      // TODO, seems redundant
      // if (isOnClosed) {
      //   // this.openGrids.push(candidate);
      //   // this.openGrids = this._sort(this.openGrids, 'rank').slice(1);
      // }
    });

    // somehow if I assigned the paths in the foreach from cadidate,
    // it would get really really bad.
    // when I used breakpoints everything was fine,
    // but on run time it would add multiples of the last candidate value insolution
    var count = 0;



    // for (var i = this.openGrids.length - paths.length; i < this.openGrids.length; i++) {
      
    //   console.log('different grids?', this.openGrids[i], 'one path?', paths[count]);

    //   // var solution = this.openGrids[i].solution;

    //   console.log('UNIQUE?', this.openGrids[i].direction);

    //   // this.openGrids[i].solution = paths[count];
    //   // this.openGrids[i].solution.push({
    //   //   'puppies': 'neat' + count
    //   // });
      


    //   count++; 
    //   console.log('Count', count, paths.length, this.openGrids.length);
    // }

    // candidates[0].solution[0] = paths[0];

    // console.log('what am I doing wrong?', paths, paths[0]);

    // candidates[1].solution[0] = paths[1];
    // if (paths[2] !== undefined) {
    //   candidates[2].solution[0] = paths[2];
    // }
    // if (paths[3] !== undefined) {
    //   candidates[3].solution[0] = paths[3];
    // }
    

    // console.log('cMOOOOOn', candidates);

    this.openGrids = this._sort(candidates, 'rank');

    // console.log('?', this.openGrids);

    // TODO!!!: THIS DUN WORK
    this.generation++;

    // TODO!!!: isOnopen...

    // TODO!!!: isonclosed...

    this.closedGrids.push(candidate);
    
    // TODO: I might need moves made in number, and actual "moves" made to solve in object
    // once I have winning object we're good, don't need nothing else.
    
    // console.log('OPEN GRIDS', this.openGrids);

    // for now just best ranked, doesn't consider equal ranked ones
    // AND WE MOVE ON!
    
    // TODO!!! this should prolly be assigned in openGrid object, and not exposed 
    // until it's solved
    // when solved say this.solution candidate.solution
    

    // var tile = [this.openGrids[0].tileMovedPosition[0], this.openGrids[0].tileMovedPosition[1], this.openGrids[0].tileMoved];

    // // console.log('TILE?', tile, this.openGrids[0].tileMovedPosition[0], this.openGrids[0].tileMovedPosition[1], this.openGrids[0].tileMoved);

    // this.openGrids[0].solution.push({
    //   'tile': tile,
    //   'direction': this.openGrids[0].direction
    // });

    // console.log('PER OBJECT SOLUTION?', this.openGrids[0].solution);

    // console.log('SOLUTION', this.solution);

    // while openGrids still have stuff
    if (this.openGrids.length !== 0) {
      this.solve(this.openGrids[0].grid, goalGrid, this.openGrids[0].emptyTile, frontier);
    }
  }

  makeFringe(emptyTile, candidate, goalGrid) {
    var grid = candidate.grid,
        fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
        rank,
        frontier = [];

    // TODO maybe make whats returned from getAllowable a readable object
    // direction = fringe[1]; is kinda obtuse
    fringe.forEach((item, index) => {
      // TODO a bit not dry with the gridLogic shuffle move thing
      var fringed = this._makeGrid(item, grid.slice(), this.emptyFringeTile),
          fringeGrid = fringed.grid,
          emptyTile = fringed.emptyTile,
          direction = item[1],
          tileMoved = item[2],
          tileMovedPosition = item[0];

      rank = this._evaluation(fringeGrid, goalGrid, this.generation);

      frontier.push({
        // 'id': this._uniqueID(),
        'grid': fringeGrid,
        'rank': rank,
        'emptyTile': emptyTile,
        'direction': direction,
        'tileMoved': tileMoved,
        'tileMovedPosition': tileMovedPosition,
        'solution': this._addPath(tileMovedPosition, tileMoved, direction, candidate.solution)
      });

      // console.log('unique?', frontier[index].solution);
    });

    // console.log('FRINGE', frontier);

    return frontier;
  }

  _addPath(tileMovedPosition, tileMoved, direction, solution) {
    var tile = [tileMovedPosition[0], tileMovedPosition[1], tileMoved],
        move,
        path = {
          'tile': tile,
          'direction': direction
        }

    if (solution.length === 0) {
      move = [path]

      return move;
    } else {
      var addOne = solution.slice();
      addOne.push(path);

      return addOne;
    }
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

  _sort(array, key) {
    return array.sort((a, b) => {
      return a[key] - b[key]
    });
  }

  _uniqueID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}

export default Solver;