// only import public methods, not whole objects. see es6 destructuring

// 1/6/16 TODO
// move
//  get canvas to move
//    translate e.pagex/y to tiles
//    fire move on allowable tiles
//    move to correct tile
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
    var moves = gridLogic.getAllowableMoves(globalState.state.emptyTile, globalState.state.grid);
    
    console.log('MOVES', moves);
    canvas.moveTile(event, moves);
  });


  //wire canvas to click, and inject allowable moves
  // ie canvas.appElement.on('click', function() {
    // canvas.move (which triggers gridlogic.move?)
  //}); 
})();

