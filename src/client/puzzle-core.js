// - only import public methods, not whole objects. see es6 destructuring
// - stuff like next move and canvas stuff might be good to be objects
//   ie, nextMoveTile = nextMove[2] is kinda vague

// 1/6/16 TODO
// move
//  get canvas to move - DONE!
//    translate e.pagex/y to tiles - DONE!
//    fire move on allowable tiles - DONE!
//    move to correct tile - DONE!
//  get grid to update, making it way easier to debug -DONE!
//  * make cursor:pointer on things that can move
/**
// 1/7/16 TODO
// solve
//  when you hit solve button, and it's solved, have grid update to solved state - DONE
//  rewrite solve algorithm to EXACTLY what the innernet said it should be
//  test for same rank trees, this is where it hangs all the time
//  make sure solve doesn't fire until final tree is made
//    right now I add to solver.solved as it loops, this may balloon when
//    trees expand
//  put in worker
//  
*/

require('./puzzle-core.scss');

import GlobalState from './components/global-state';
import Canvas from './components/canvas';
import GridLogic from './components/grid-logic';
import Solver from './components/solver';

(() => {
  requestAnimationFrame = window.requestAnimationFrame ||
                          window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.msRequestAnimationFrame;

  var initialState = {
    gridSize: 4,
    shuffleTimes: 20,
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
  solver.init(globalState.state);

  // bind solve
  // maybe only share global state explicitly? like this?
  // so components don't need to maintain global state internaly.
  solver.solveButton.addEventListener('click', (event) => {
    var solveInterval;

    solver.solve(globalState.state.grid, globalState.state.goalGrid, globalState.state.emptyTile, []);

    var moveCount = 0;


    // TODO: put into function
    solveInterval = setInterval(() => {
      
      if (solver.solution !== undefined) {

        if (moveCount >= solver.solution.length) {
          clearInterval(solveInterval);
          return;
        }

        canvas.redrawMovedTile(solver.solution[moveCount].tile, solver.solution[moveCount].direction);
        moveCount++;
      }
    }, 300);
    

  });

  // move
  canvas.appElement.addEventListener('click', (event) => {
    var moves = gridLogic.getAllowableMoves(globalState.state.emptyTile, globalState.state.grid);
    var nextMove = canvas.moveTile(event, moves);
    
    if (nextMove !== false) {
      var nextMovePosition = nextMove[0],
          nextMoveTile = nextMove[2];

      // TODO: Again not DRY, used in gridlogic and solver
      // START should be a global function passed into stuff that needs it
      var toPosition = globalState.state.emptyTile;

      globalState.state.emptyTile = nextMovePosition;
      globalState.state.grid[nextMoveTile] = toPosition;
      // END should be a global function passed into stuff that needs it
    }

    // console.log('NEXT', nextMove);
  });
})();

