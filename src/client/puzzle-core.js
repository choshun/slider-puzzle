/**
 * Puzzle Core
 *
 * Bootstraps the puzzle.
 * All DOM bindings and app.state properties
 * should be set here.
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
require('./puzzle-core.scss');

import App from './components/app';
import PuzzleSelect from './components/puzzle-select';
import Modal from './components/modal';
import Canvas from './components/canvas';
import GridLogic from './components/grid-logic';
import Solver from './components/solver';

(() => {
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
    document.querySelector('.configure-puzzle')
        .addEventListener('click', (event) => {
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

