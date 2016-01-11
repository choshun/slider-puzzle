// - only import public methods, not whole objects. see es6 destructuring - not possible cause I'm using errything
// - stuff like next move and canvas stuff might be good to be objects
//   ie, nextMoveTile = nextMove[2] is kinda vague
// - shuffle button? - is retry button
// - update grid after all moved are done - Cheating with retry button

  
// !!! TODO replace all foreaches with:
// http://jsperf.com/for-vs-foreach/66

  // maybe only share global state explicitly?
  // so components don't need to maintain global state internaly. -DONE

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
      Style modal/global elements - DONE
      Intro when you click a radio it drives the global state - DONE
      When you hit looks good it closes - DONE
      show something when you hit solve "try again" - DONE
      show something when you win "you did it in 5 moves!" -DONE
      show something when solve borks - DONE

    puzzle
      retry button with presets - DONE,
      fire when user gets to goal - DONE
      hint button - DONE

  1/11/16 TODO
    close puzzle
    puzzle - finally do puzzle animation - DONE
    jsdocs
    readme
    gjslint, csscomb... BOOM
*/

require('./puzzle-core.scss');

import App from './components/app';
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
    shuffleTimes: 30,
    appElement: document.getElementById('app'),
    puzzleConfig: {
      player: 'Broseph',
      size: [
        {
          name: '3 by 3',
          value: 3
        },
        {
          name: '4 by 4',
          value: 4
        },
        {
          name: '5 by 5',
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

  var app = new App(initialState);
  var puzzleSelect = new PuzzleSelect(app);
  var modal = new Modal(app);
  var gridLogic = new GridLogic(app);
  var canvas = new Canvas(app);
  var solver = new Solver(app);

  var resizeTimeout,
      steps = 0;

  const LOCKED_CLASS = '_locked';
  const OPEN_CLASS = '_open';
  const HIDDEN_CLASS = '_hidden';
  const PUZZLE_TIME = '_puzzle-time';
  const MODAL_TIMEOUT = 200;

  function init() {
    // creates puzzle image list
    puzzleSelect.render();
    // creates puzzle configuration modal
    modal.renderIntro();
    // lock viewport
    document.body.classList.add(LOCKED_CLASS);

    bindModalCloseButton();
    bindPuzzleSelection();
    bindModalSelection();
    // bindPuzzleCloseButton();
  }

  function startPuzzle(selectedImage) {
    app.state.appElement.classList.add(PUZZLE_TIME);
    
    // set up the board
    buildPuzzle();

    // paint the puzzle
    canvas.init(app, selectedImage);

    bindSolveButton();
    bindRetryButton(document.querySelector('footer'));

    bindMove();
    bindResize();
  }
  
  function buildPuzzle() {
    solver.solveButton.classList.remove(HIDDEN_CLASS);

    // Make a shuffled grid
    gridLogic.init(app);

    app.setProperty('grid', gridLogic.shuffledGrid);
    app.setProperty('goalGrid', gridLogic.goalGrid);
    app.setProperty('emptyTile', gridLogic.emptyTile);

    // Get ready to solve
    solver.init(app.state);
    bindHintButton();
  }

  function bindPuzzleSelection() {
    var puzzleList = document.querySelector('.puzzle-list');

    puzzleList.addEventListener('click', function(event) {
      var selectedPuzzle = event.target.getAttribute('id');

      document.body.classList.add(LOCKED_CLASS);
      startPuzzle(selectedPuzzle);
    });
  }

  function hideButtons() {
    solver.solveButton.classList.add(HIDDEN_CLASS);
    solver.hintButton.classList.add(HIDDEN_CLASS);
    gridLogic.retryButton.classList.add(HIDDEN_CLASS);
  }

  function bindModalSelection() {
    document.querySelector('.configure-puzzle').addEventListener('click', (event) => {
      var target = event.target;

      if (target.type === 'radio') {
        var puzzleParam = target.getAttribute('name'),
            value = target.getAttribute('id');

        app.setProperty(puzzleParam, value);
      }
    });
  }

  function bindPuzzleCloseButton() {
    document.querySelector('.close-button').addEventListener('click', (event) => {
      app.state.appElement.removeChild(canvas.canvas);
      app.state.appElement.classList.remove(PUZZLE_TIME);
      document.body.classList.remove(LOCKED_CLASS);
      hideButtons();
    });
  }

  function bindRetryButton(parent) {
    parent.querySelector('.retry-button').addEventListener('click', (event) => {
      // destroy canvas
      app.state.appElement.removeChild(canvas.canvas);
      solver.hintButton.classList.remove(HIDDEN_CLASS);
      gridLogic.retryButton.classList.remove(HIDDEN_CLASS);
      buildPuzzle();
      
      // paint the puzzle
      canvas.init(app);
      steps = 0;

      if (event.target.classList.contains('in-modal')) {
        modal.modal.classList.remove(OPEN_CLASS);
      }
    });
  }

  function bindHintButton() {
    var origText = solver.hintButton.textContent;

    solver.hintButton.addEventListener('click', (event) => {
      var moves = app.getAllowableMoves(app.state.emptyTile, app.state.grid),
          i,
          ranked = [],
          hint;

      for (i = 0; i < moves.length; i++) {
        var fringed = solver.makeFringeGrid(moves[i], app.state.grid.slice(), app.state.emptyTile.slice()),
            rank = solver.evaluation(fringed.grid, app.state.goalGrid, 1);
        ranked.push({
          'rank': rank,
          'move': i
        });
      }

      ranked = solver.sort(ranked, 'rank');

      // ranked[0] is lowest rank after sort (see solver.sort)
      hint = moves[ranked[0].move][1];
      solver.hintButton.innerHTML = `GO ${hint}!`;

      setTimeout(() => {
        solver.hintButton.innerHTML = origText;
      }, 1500);
    });
  }

  function bindModalCloseButton() {
    document.querySelector('.modal-close').addEventListener('click', (event) => {
      modal.modal.classList.remove(OPEN_CLASS);
      document.body.classList.remove(LOCKED_CLASS);
    });
  }

  function bindSolveButton() {
    solver.solveButton.addEventListener('click', (event) => {
      var solveInterval,
          moveCount = 0;
      
      hideButtons();
      solver.solve(app.state.grid, app.state.goalGrid, app.state.emptyTile);
      
      if (solver.solution === 'fail') {
        modal.renderError();
        bindRetryButton(modal.modal);
        return;
      }

      // TODO: will be replaced with a wroker, so postMessage stuff
      solveInterval = setInterval(() => {
        
        if (solver.solution !== undefined) {
          
          if (moveCount >= solver.solution.length) {
            
            clearInterval(solveInterval);
            
            setTimeout(() => {
              modal.renderSolved(solver.solution.length);
              bindRetryButton(modal.modal);
            }, MODAL_TIMEOUT);
            
            return;
          }

          canvas.redrawMovedTile(solver.solution[moveCount].tile, solver.solution[moveCount].direction);
          moveCount++;
        }
      }, 300);
    });
  }

  function bindMove() {
    app.state.appElement.addEventListener('click', (event) => {
      var moves = app.getAllowableMoves(app.state.emptyTile, app.state.grid),
          nextMove = canvas.moveTile(event, moves);
      
      if (nextMove !== false) {
        var nextMovePosition = nextMove[0],
            nextMoveTile = nextMove[2],
            toPosition = app.state.emptyTile;

        steps++;

        // update grid
        app.state.emptyTile = nextMovePosition;
        app.state.grid[nextMoveTile] = toPosition;

        // if you solved it 
        if (solver.isSameArray(app.state.grid, app.state.goalGrid)) {
          
          setTimeout(() => {
            modal.renderWinning(steps);
            hideButtons();
            bindRetryButton(modal.modal);
            steps = 0;
          }, MODAL_TIMEOUT);
        }
      }
    });
  }

  function bindResize() {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        app.state.appElement.removeChild(canvas.canvas);
        canvas.init(app);
      }, 400);
    });
  }

  init();

})();

