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
    gridSize: 3,
    shuffleTimes: 1,
    canvas: [
      {
        'image': '/images/sc4a.jpg',
        'name': 'test1'
      }
    ]
  }

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

  //wire canvas to click, and inject allowable moves
  // canvas.appElement.on('click', function() {
    // canvas.move (which triggers gridlogic.move?)
  //}); 
})();
