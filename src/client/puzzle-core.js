// - only import public methods, not whole objects. see es6 destructuring
// - stuff like next move and canvas stuff might be good to be objects
//   ie, nextMoveTile = nextMove[2] is kinda vague
// - shuffle button?
// - update grid after all moved are done


    
    // !!! TODO replace all foreaches with:
    // http://jsperf.com/for-vs-foreach/66


  // maybe only share global state explicitly?
  // so components don't need to maintain global state internaly.

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
//  make each grid have it's history for open/closed grid path comparisons
//  rewrite solve algorithm to EXACTLY what the innernet said it should be
//    not on open or closed - DONE
//    on closed - :(
//    on open - DONE
//  test for same rank trees, this is where it hangs all the time - kinda done? should be addressed by prev todo
//  make sure solve doesn't fire until final tree is made
//    right now I add to solver.solved as it loops, this may balloon when
//    trees expand - DONE(ish)
//  put in worker

//  1/9/16 TODO
//  canvas prettifying
//    make responsive
//      center any uploaded image in canvas based on image size - DONE
//      center canvas element in center of page -DONE
//      If image is too big make tiles fit to 100% viewport -DONE
//        center image in smaller viewport -DONE
//      when resize repaint canvas - DONE
//  
//    add image as blurred bg
//    when canvas paints after image selection make it 
//      have a cool animation 
//      (different global-alphas and maybe position)
//
//  intro/outro
//    make a modal with passed in elements,
//      render element in model
//      ie {
        "p": "good job",
        "button": {
          "value": 25,
          "text": "shuffle amount"
        }
      }
      or just pass in elements... that's easier - DONE

// 1/10/16 TODO
    modal
      Style modal/global elements
      Intro when you click a radio it drives the global state
      When you hit looks good it closes

    puzzle
      retry button with presets - DONE
*/

require('./puzzle-core.scss');

import GlobalState from './components/global-state';
import PuzzleSelect from './components/puzzle-select';
import Modal from './components/modal';
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
    shuffleTimes: 50,
    appElement: document.getElementById('app'),
    puzzleConfig: {
      player: 'Broseph',
      size: [
        {
          name: '3*3',
          value: 3
        },
        {
          name: '4*4',
          value: 4
        },
        {
          name: '5*5',
          value: 5
        },
      ],
      shuffle: [
        {
          name: 'A little - 15',
          value: 15
        },
        {
          name: 'An amount - 30',
          value: 30
        },
        {
          name: 'The limit at which my solver consistently works - 50',
          value: 50
        },
      ]
    },
    canvas: [
      {
        'image': '/images/sc4a.jpg',
        'name': 'art'
      },
      {
        'image': '/images/sc4a.jpg',
        'name': 'art'
      },
      {
        'image': '/images/cat1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/bear-shark-unicornsurfing.jpg',
        'name': 'surfing'
      },
      {
        'image': '/images/bear-shark-unicornsurfing.jpg',
        'name': 'surfing'
      },
      {
        'image': '/images/sc4a.jpg',
        'name': 'art'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/cat1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },

      {
        'image': '/images/small-cat.png',
        'name': 'smaller cat'
      },
      {
        'image': '/images/cat1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/ps-battle1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/ps-battle1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/sc4a.jpg',
        'name': 'art'
      },
      {
        'image': '/images/cat1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },

      {
        'image': '/images/small-cat.png',
        'name': 'smaller cat'
      },
      {
        'image': '/images/pretty.jpg',
        'name': 'cat!'
      },

      {
        'image': '/images/sc4a.jpg',
        'name': 'art'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/shmeh.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/shmeh.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/pretty.jpg',
        'name': 'smaller cat'
      },
      {
        'image': '/images/shmeh.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/ps-battle1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/shmeh.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },

      {
        'image': '/images/ps-battle1.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/shmeh.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/cat.jpg',
        'name': 'cat!'
      },
      {
        'image': '/images/small-cat.png',
        'name': 'smaller cat'
      },
      {
        'image': '/images/bear-shark-unicornsurfing.jpg',
        'name': 'surfing'
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
  var puzzleSelect = new PuzzleSelect(initialState);
  var modal = new Modal(initialState);
  var gridLogic = new GridLogic(globalState);
  var canvas = new Canvas(globalState, gridLogic);
  var solver = new Solver(globalState, gridLogic, canvas);

  var resizeTimeout;

  function init() {
    puzzleSelect.render();
    // modal.renderIntro();

    // lock viewport
    // document.body.classList.add('locked');

    bindPuzzleSelection();
    bindModalSelection();

    //startPuzzle();


  }

  function bindPuzzleSelection() {
    var puzzleList = document.querySelector('.puzzle-list');

    puzzleList.addEventListener('click', function(event) {
      document.body.classList.add('locked');
      startPuzzle(event.target.getAttribute('id'));
    });
  }

  function bindModalSelection() {

  }

  function buildPuzzle() {

    // Make a shuffled grid
    gridLogic.init();

    globalState.setProperty('grid', gridLogic.shuffledGrid);
    globalState.setProperty('goalGrid', gridLogic.goalGrid);
    globalState.setProperty('emptyTile', gridLogic.emptyTile);

    // Get ready to solve
    solver.init(globalState.state);
  }

  function startPuzzle(selectedImage) {
    // Set up the board
    document.querySelector('main').classList.add('puzzle-time');

    buildPuzzle();

    // paint the puzzle
    canvas.init(selectedImage);

    bindSolveButton();
    bindRetryButton();
    bindMove();
    bindResize();
  }

  function bindRetryButton() {
    document.querySelector('.retry-button').addEventListener('click', (event) => {
      // destroy canvas
      globalState.state.appElement.removeChild(canvas.canvas);
      buildPuzzle();
      
      // paint the puzzle
      canvas.init();
    });
  }

  function bindSolveButton() {
    solver.solveButton.addEventListener('click', (event) => {
      var solveInterval,
          moveCount = 0;
      
      // just pass in global, with global functions and everything
      solver.solve(globalState.state.grid, globalState.state.goalGrid, globalState.state.emptyTile);
      
      // TODO: will be replaced with a wroker, so postMessage stuff
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
  }

  function bindMove() {
    globalState.state.appElement.addEventListener('click', (event) => {
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

        // if you solved it 
        if (solver.isSameArray(globalState.state.grid, globalState.state.goalGrid)) {
          console.log('done!');
          // show outro/save
        }
        
      }
    });
  }

  function bindResize() {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        canvas.init();
      }, 400);
    });
  }

  init();

})();

