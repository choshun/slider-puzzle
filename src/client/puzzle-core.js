// - only import public methods, not whole objects. see es6 destructuring
// - stuff like next move and canvas stuff might be good to be objects
//   ie, nextMoveTile = nextMove[2] is kinda vague

// 1/6/16 TODO
// move
//  get canvas to move - DONE!
//    translate e.pagex/y to tiles - DONE!
//    fire move on allowable tiles - DONE!
//    move to correct tile - DONE!
//  get grid to update
//  * make cursor:pointer on things that can move



require('./puzzle-core.scss');

import GlobalState from './components/global-state';
import Canvas from './components/canvas';
import GridLogic from './components/grid-logic';
import Solver from './components/solver';

(function() {
  requestAnimationFrame = window.requestAnimationFrame ||
                          window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.msRequestAnimationFrame;

  var initialState = {
    gridSize: 5,
    shuffleTimes: 10000,
    canvas: [
      {
        'image': '/images/cat.jpg',
        'name': 'test1'
      }
    ]
  };

  // TODO ok, put allowable in application, call it find fringe, sounds fancier
  // have move in app, but define and assign it in here, core.

  // remember, last move is assigned somewhere weird in gridlogic

  // TODO Not liking the dependancies
  // maybe have allowable moves in global-state, and just call it 
  // application? Maybe also move... have move be the only custom
  // event? (needs to change/use gridlogic.move and canvas.move from solver)
  var globalState = new GlobalState(initialState);
  var gridLogic = new GridLogic(globalState);
  var canvas = new Canvas(globalState, gridLogic);
  var solver = new Solver(globalState, gridLogic, canvas);

  // Set up the board
  gridLogic.init();

  // TODO Might not need this, can just reference this in gridLogic.grid
  globalState.setProperty('grid', gridLogic.shuffledGrid);
  globalState.setProperty('goalGrid', gridLogic.goalGrid);
  globalState.setProperty('emptyTile', gridLogic.emptyTile);


  // TODO maybe not do init, and just fire them directly so 
  // it's easier to read?

  // Paint the sliding puzzle using global state's shuffled grid
  canvas.init();

  // Get ready to solve
  solver.init();

  // bind solve
  // maybe only share global state explicitly? like this?
  // so components don't need to maintain global state internaly.
  solver.solveButton.addEventListener('click', (event) => {
    // console.log('GRID', globalState.state.grid);
    // console.log('GOAL', globalState.state.goalGrid);
    solver.solve(globalState.state.grid, globalState.state.goalGrid, globalState.state.emptyTile);
    console.log('OPEN GRIDS', solver.openGrids, 'CLOSED', solver.closedGrids);
  });

  // move
  canvas.appElement.addEventListener('click', (event) => {
    // get allowable moves from current grid state
    var moves = gridLogic.getAllowableMoves(globalState.state.emptyTile, globalState.state.grid);
    
    // if the tile clicked is allowable, return move, else false
    var nextMove = canvas.moveTile(event, moves);
    
    // move
    if (nextMove !== false) {
      // update grid
      var nextMovePosition = nextMove[0],
          nextMoveTile = nextMove[2];

      // TODO: Again not DRY, used in gridlogic and solver
      // START should be a global function passed into stuff that needs it
      var toPosition = globalState.state.emptyTile;

      globalState.state.emptyTile = nextMovePosition;
      globalState.state.grid[nextMoveTile] = toPosition;
      // END should be a global function passed into stuff that needs it
    }

    console.log('NEXT', nextMove);
  });
})();

