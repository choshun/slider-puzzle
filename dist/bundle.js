/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	      Intro when you click a radio it drives the global state - DONE
	      When you hit looks good it closes - DONE

	    puzzle
	      retry button with presets - DONE,
	      fire when user gets to goal - DONE
	*/

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _componentsGlobalState = __webpack_require__(1);

	var _componentsGlobalState2 = _interopRequireDefault(_componentsGlobalState);

	var _componentsPuzzleSelect = __webpack_require__(2);

	var _componentsPuzzleSelect2 = _interopRequireDefault(_componentsPuzzleSelect);

	var _componentsModal = __webpack_require__(7);

	var _componentsModal2 = _interopRequireDefault(_componentsModal);

	var _componentsCanvas = __webpack_require__(3);

	var _componentsCanvas2 = _interopRequireDefault(_componentsCanvas);

	var _componentsGridLogic = __webpack_require__(4);

	var _componentsGridLogic2 = _interopRequireDefault(_componentsGridLogic);

	var _componentsSolver = __webpack_require__(5);

	var _componentsSolver2 = _interopRequireDefault(_componentsSolver);

	__webpack_require__(6);

	(function () {
	  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	  var initialState = {
	    gridSize: 4,
	    shuffleTimes: 30,
	    appElement: document.getElementById('app'),
	    puzzleConfig: {
	      player: 'Broseph',
	      size: [{
	        name: '3 by 3',
	        value: 3
	      }, {
	        name: '4 by 4',
	        value: 4
	      }, {
	        name: '5 by 5',
	        value: 5
	      }],
	      shuffle: [{
	        name: 'A little - 15',
	        value: 15
	      }, {
	        name: 'An amount - 30',
	        value: 30
	      }, {
	        name: 'The limit at which my solver consistently works - 50',
	        value: 50
	      }]
	    },
	    canvas: [{
	      'image': '/images/sc4a.jpg',
	      'name': 'art'
	    }, {
	      'image': '/images/sc4a.jpg',
	      'name': 'art'
	    }, {
	      'image': '/images/cat1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/bear-shark-unicornsurfing.jpg',
	      'name': 'surfing'
	    }, {
	      'image': '/images/bear-shark-unicornsurfing.jpg',
	      'name': 'surfing'
	    }, {
	      'image': '/images/sc4a.jpg',
	      'name': 'art'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/cat1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/small-cat.png',
	      'name': 'smaller cat'
	    }, {
	      'image': '/images/cat1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/ps-battle1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/ps-battle1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/sc4a.jpg',
	      'name': 'art'
	    }, {
	      'image': '/images/cat1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/small-cat.png',
	      'name': 'smaller cat'
	    }, {
	      'image': '/images/pretty.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/sc4a.jpg',
	      'name': 'art'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/shmeh.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/shmeh.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/pretty.jpg',
	      'name': 'smaller cat'
	    }, {
	      'image': '/images/shmeh.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/ps-battle1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/shmeh.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/ps-battle1.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/shmeh.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/cat.jpg',
	      'name': 'cat!'
	    }, {
	      'image': '/images/small-cat.png',
	      'name': 'smaller cat'
	    }, {
	      'image': '/images/bear-shark-unicornsurfing.jpg',
	      'name': 'surfing'
	    }]
	  };

	  // TODO ok, put allowable in application, call it find fringe, sounds fancier
	  // have move in app, but define and assign it in here, core.

	  // remember, last move is assigned somewhere weird in gridlogic

	  // TODO Not liking the dependancies
	  // maybe have allowable moves in global-state, and just call it
	  // application? Maybe also move... have move be the only custom
	  // event? (needs to change/use gridlogic.move and canvas.move from solver)
	  var globalState = new _componentsGlobalState2['default'](initialState);
	  var puzzleSelect = new _componentsPuzzleSelect2['default'](initialState);
	  var modal = new _componentsModal2['default'](initialState);
	  var gridLogic = new _componentsGridLogic2['default'](globalState);
	  var canvas = new _componentsCanvas2['default'](globalState, gridLogic);
	  var solver = new _componentsSolver2['default'](globalState, gridLogic);

	  var resizeTimeout;

	  function init() {
	    puzzleSelect.render();
	    modal.renderIntro();

	    // lock viewport
	    document.body.classList.add('locked');

	    bindModalCloseButton();
	    bindPuzzleSelection();
	    bindModalSelection();
	  }

	  function startPuzzle(selectedImage) {
	    document.querySelector('main').classList.add('puzzle-time');

	    // set up the board
	    buildPuzzle();

	    // paint the puzzle
	    canvas.init(globalState, selectedImage);

	    bindSolveButton();
	    bindRetryButton();
	    bindMove();
	    bindResize();
	  }

	  function buildPuzzle() {
	    solver.solveButton.classList.remove('hidden');

	    // Make a shuffled grid
	    gridLogic.init(globalState);

	    globalState.setProperty('grid', gridLogic.shuffledGrid);
	    globalState.setProperty('goalGrid', gridLogic.goalGrid);
	    globalState.setProperty('emptyTile', gridLogic.emptyTile);

	    // Get ready to solve
	    solver.init(globalState.state);
	  }

	  function bindPuzzleSelection() {
	    var puzzleList = document.querySelector('.puzzle-list');

	    puzzleList.addEventListener('click', function (event) {
	      document.body.classList.add('locked');
	      var selectedPuzzle = event.target.getAttribute('id');
	      // TODO: add bg to selected tiles
	      // puzzleSelect.selectPuzzle(selectedPuzzle);
	      startPuzzle(selectedPuzzle);
	    });
	  }

	  function bindModalSelection() {
	    document.querySelector('.configure-puzzle').addEventListener('click', function (event) {
	      var target = event.target;

	      if (target.type === 'radio') {
	        var puzzleParam = target.getAttribute('name'),
	            value = target.getAttribute('id');

	        globalState.setProperty(puzzleParam, value);
	      }
	    });
	  }

	  function bindRetryButton() {
	    document.querySelector('.retry-button').addEventListener('click', function (event) {
	      // destroy canvas
	      globalState.state.appElement.removeChild(canvas.canvas);
	      buildPuzzle();

	      // paint the puzzle
	      canvas.init(globalState);
	    });
	  }

	  function bindModalCloseButton() {
	    document.querySelector('.modal-close').addEventListener('click', function (event) {
	      modal.modal.classList.remove('open');
	      document.body.classList.remove('locked');
	    });
	  }

	  function bindSolveButton() {
	    solver.solveButton.addEventListener('click', function (event) {
	      var solveInterval,
	          moveCount = 0;

	      // TODO: A crutch for now, when you hit solve after solving it borks
	      solver.solveButton.classList.add('hidden');

	      // just pass in global, with global functions and everything
	      solver.solve(globalState.state.grid, globalState.state.goalGrid, globalState.state.emptyTile);

	      // TODO: will be replaced with a wroker, so postMessage stuff
	      solveInterval = setInterval(function () {

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
	    globalState.state.appElement.addEventListener('click', function (event) {
	      var moves = gridLogic.getAllowableMoves(globalState.state.emptyTile, globalState.state.grid),
	          nextMove = canvas.moveTile(event, moves);

	      if (nextMove !== false) {
	        var nextMovePosition = nextMove[0],
	            nextMoveTile = nextMove[2],
	            toPosition = globalState.state.emptyTile;

	        // update grid
	        globalState.state.emptyTile = nextMovePosition;
	        globalState.state.grid[nextMoveTile] = toPosition;

	        // if you solved it
	        if (solver.isSameArray(globalState.state.grid, globalState.state.goalGrid)) {
	          console.log('done!');
	          // show outro/save
	        }
	      }
	    });
	  }

	  function bindResize() {
	    window.addEventListener('resize', function () {
	      clearTimeout(resizeTimeout);

	      resizeTimeout = setTimeout(function () {
	        globalState.state.appElement.removeChild(canvas.canvas);
	        canvas.init(globalState);
	      }, 400);
	    });
	  }

	  init();
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 * @class GlobalState
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var GlobalState = (function () {

	  /*
	   * @constructs App
	   * @param {Object} options
	   */

	  function GlobalState(state) {
	    _classCallCheck(this, GlobalState);

	    this.state = state || {};
	    console.log('state!!', this.state);
	  }

	  _createClass(GlobalState, [{
	    key: 'set',
	    value: function set(state) {
	      this.state = state;
	    }
	  }, {
	    key: 'setProperty',
	    value: function setProperty(key, value) {
	      this.state[key] = value;
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.state;
	    }
	  }, {
	    key: 'test',
	    value: function test() {
	      console.log('TET!');
	    }

	    /*
	     * @method render
	     * @param {DOM} [element]
	     * @returns {String|undefined}
	     */
	    // render(element) {
	    //   this.element = element || this.element;

	    //   return;
	    // }
	  }]);

	  return GlobalState;
	})();

	exports['default'] = GlobalState;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	 * @class PuzzleSelect
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var PuzzleSelect = (function () {
	  function PuzzleSelect(globalState) {
	    _classCallCheck(this, PuzzleSelect);

	    this.state = globalState || {};
	    this.puzzles = [];
	    this.selectedPuzzle;
	    this._images = this._getImages(this.state.canvas);
	  }

	  _createClass(PuzzleSelect, [{
	    key: 'render',
	    value: function render() {
	      var i,
	          puzzles,
	          section = document.createElement('section'),
	          html = '\n            <ul class="puzzle-list">\n              ' + this._images.map(function (image) {
	        return '\n                <li class="puzzle" style="background-image:url(' + image + ')" id="' + image + '">\n                </li>';
	      }).join('\n') + '\n            </ul>\n        ';

	      section.setAttribute('class', 'select-puzzle');
	      section.innerHTML = html;
	      this.state.appElement.appendChild(section);
	    }
	  }, {
	    key: '_getImages',
	    value: function _getImages(canvasImages) {
	      var i,
	          images = [];

	      for (i = 0; i < canvasImages.length; i++) {
	        images.push(canvasImages[i].image);
	      }

	      return images;
	    }
	  }]);

	  return PuzzleSelect;
	})();

	exports['default'] = PuzzleSelect;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	 * @class Canvas
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Canvas = (function () {

	  /*
	   * @constructs Canvas
	   * @param {Object} state options
	   */

	  function Canvas(globalState) {
	    _classCallCheck(this, Canvas);

	    this.state = globalState.state || {};

	    // Canvas stuff
	    this.canvas;
	    this.context;
	    this.imageObj;
	    this.selectedImage;

	    // For animation
	    this._iteration = 0, this._totalIterations = 10;

	    // For canvas grid
	    this.gridSize;

	    // set after image is loaded
	    this._width = 0;
	    this._height = 0;
	    this._tileWidth = 0;
	    this._tileHeight = 0;
	    this._bgOffsetY = 0;
	    this._bgOffsetX = 0;
	    this._directionLookup = {
	      'UP': -1,
	      'DOWN': +1,
	      'LEFT': -1,
	      'RIGHT': +1
	    };
	  }

	  _createClass(Canvas, [{
	    key: 'init',
	    value: function init(globalObject, selectedImage) {
	      this.gridSize = globalObject.state.gridSize;
	      this.canvas = this._createCanvas();
	      this.context = this.canvas.getContext('2d');

	      // paint
	      this.selectedImage = selectedImage || this.selectedImage;
	      this._loadImage(this.selectedImage);
	    }
	  }, {
	    key: 'moveTile',
	    value: function moveTile(event, moves) {
	      var offsetX = event.layerX,
	          offsetY = event.layerY;

	      var tile = this._getTile(offsetX, offsetY);
	      // maybe just get direction? (tile, direction) seems more understandable
	      var nextMove = this._getValidMove(tile, moves);

	      if (nextMove !== false) {
	        // tile is [left, top, origTile], done this way for solver.solution
	        this.redrawMovedTile(tile, nextMove[1]);
	      }

	      return nextMove;
	    }
	  }, {
	    key: 'redrawMovedTile',
	    value: function redrawMovedTile(selectedTile, nextMove) {
	      var _this = this;

	      var easingValue,
	          direction = nextMove,
	          // TODO kinda jenky
	      easingY = 0,
	          easingX = 0;

	      if (direction === 'UP' || direction === 'DOWN') {
	        easingValue = this._easeInOutQuad(this._iteration, 0, this._tileHeight, this._totalIterations);

	        easingY = this._directionLookup[direction] * easingValue;
	      } else {
	        easingValue = this._easeInOutQuad(this._iteration, 0, this._tileWidth, this._totalIterations);

	        easingX = this._directionLookup[direction] * easingValue;
	      }

	      this.context.closePath();

	      this.context.clearRect(this._tileWidth * selectedTile[0], this._tileHeight * selectedTile[1], this._tileWidth, this._tileHeight);

	      this.context.drawImage(this.imageObj, this._tileWidth * this.state.goalGrid[selectedTile[2]][0] - this._bgOffsetX, // tile bg position x
	      this._tileHeight * this.state.goalGrid[selectedTile[2]][1] - this._bgOffsetY, // tile bg position y
	      this._tileWidth, this._tileHeight, this._tileWidth * selectedTile[0] + easingX, // tile position X
	      this._tileHeight * selectedTile[1] + easingY, // tile position Y
	      this._tileWidth, this._tileHeight);

	      if (this._iteration < this._totalIterations) {
	        this._iteration++;
	        requestAnimationFrame(function () {
	          return _this.redrawMovedTile(selectedTile, nextMove);
	        });
	      } else {
	        this._iteration = 0;
	      }
	    }

	    // TODO, for resize I may wanna not have imageWidth/appwidth stuff in here,
	    // have as seperate function
	  }, {
	    key: '_loadImage',
	    value: function _loadImage(selectedImage) {
	      var _this2 = this;

	      this.imageObj = new Image();

	      this.imageObj.onload = function () {

	        var cover = _this2._width > _this2._height ? _this2._width : _this2._height,
	            image = _this2.imageObj,
	            imageWidth = image.width,
	            imageHeight = image.height,
	            appElement = _this2.state.appElement,
	            smallX = appElement.offsetWidth < imageWidth,
	            smallY = appElement.offsetHeight < imageHeight,
	            offsetY = (appElement.offsetHeight - imageHeight) / 2,
	            offsetX = (appElement.offsetWidth - imageWidth) / 2;

	        if (smallX) {
	          _this2.canvas.classList.add('small-x');
	          // kinda jenky, adding small-x makes it position: fixed,
	          // left: 0. Flex box no longer works, adding the offset
	          _this2.canvas.style.top = !smallY ? offsetY + 'px' : 0;
	        } else {
	          _this2.canvas.classList.remove('small-x');
	          _this2.canvas.style.top = 'auto';
	        }

	        _this2._width = smallX ? appElement.offsetWidth : imageWidth;
	        _this2._height = smallY ? appElement.offsetHeight : imageHeight;
	        _this2._tileWidth = _this2._width / _this2.gridSize;

	        console.log('canvas gridSize', _this2.gridSize);
	        _this2._tileHeight = _this2._height / _this2.gridSize;

	        _this2.canvas.setAttribute('height', _this2._height);
	        _this2.canvas.setAttribute('width', _this2._width);
	        _this2._drawTiles(offsetY, offsetX);
	      };

	      this.imageObj.src = selectedImage;
	    }
	  }, {
	    key: '_drawTiles',
	    value: function _drawTiles(offsetY, offsetX) {
	      var i = 0,
	          j = 0,
	          count = 0;

	      // this.context.font = "30px Helvetica";
	      // this.context.fillStyle = "#ff00ff";

	      // TODO: maybe do before passed,
	      // but it messes up canvas centering first try
	      this._bgOffsetX = offsetX < 0 ? offsetX : 0, this._bgOffsetY = offsetY < 0 ? offsetY : 0;

	      for (j = 0; j < this.gridSize; j++) {
	        for (i = 0; i < this.gridSize; i++) {
	          var tile, placementX, placementY;

	          if (count < this.state.grid.length) {
	            this.context.beginPath();
	            this.context.stroke();

	            // tile[0] is upperleft tile, it contains it's x, y in grid.
	            // Could be shuffled, ie tile[0] is [1, 1], which means the upperleft part
	            // of the original pic is now at 1 tile to the right, 1 tile down
	            tile = this.state.grid[count];
	            placementX = tile[0];
	            placementY = tile[1];

	            this.context.drawImage(this.imageObj, this._tileWidth * i - this._bgOffsetX, // tile bg position x
	            this._tileHeight * j - this._bgOffsetY, // tile bg position y
	            this._tileWidth, this._tileHeight, this._tileWidth * placementX, // tile position x
	            this._tileHeight * placementY, // tile position y
	            this._tileWidth, this._tileHeight);
	          }

	          // this.context.fillText(count, this._tileWidth * placementX + 20, this._tileHeight * placementY + 20);

	          count++;
	        }
	      }

	      this.context.fill();
	    }
	  }, {
	    key: '_getTile',
	    value: function _getTile(offsetX, offsetY) {
	      var left = Math.floor(offsetX / this._tileWidth),
	          top = Math.floor(offsetY / this._tileHeight);

	      var origTile = this._findArraysIndex(this.state.grid, [left, top]);

	      return [left, top, origTile]; //return tile for grid logic, top and left for canvas
	    }
	  }, {
	    key: '_findArraysIndex',
	    value: function _findArraysIndex(arrays, array) {
	      var i = 0,
	          n = arrays.length;

	      for (; i < n; i++) {
	        if (array[0] === arrays[i][0] && array[1] === arrays[i][1]) {
	          return i;
	        }
	      }

	      return -1;
	    }
	  }, {
	    key: '_getValidMove',
	    value: function _getValidMove(tile, moves) {
	      var tiledMoved = tile[2],
	          validTile,
	          nextMove = false;

	      moves.forEach(function (move) {
	        validTile = move[2];

	        if (tiledMoved === validTile) {
	          nextMove = move;
	          return;
	        }
	      });

	      return nextMove;
	    }
	  }, {
	    key: '_createCanvas',
	    value: function _createCanvas() {
	      var canvas = document.createElement('canvas');
	      canvas.setAttribute('class', 'scene');
	      this.state.appElement.appendChild(canvas);

	      return canvas;
	    }
	  }, {
	    key: '_easeInOutQuad',
	    value: function _easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
	      if ((currentIteration /= totalIterations / 2) < 1) {
	        return changeInValue / 2 * currentIteration * currentIteration + startValue;
	      }
	      return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
	    }
	  }]);

	  return Canvas;
	})();

	exports['default'] = Canvas;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
	 * @class GridLogic
	 * Responsible for setting up the grid, and maintaining it
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var GridLogic = (function () {

	  /*
	   * @constructs GridLogic
	   * @param {Object} options
	   */

	  function GridLogic() {
	    _classCallCheck(this, GridLogic);

	    this.gridSize;
	    this.goalGrid;
	    this.shuffledGrid;
	    this.emptyTile;
	    this.allowableMoves;
	    this.shuffleMoves;
	    this.lastDirection;
	  }

	  _createClass(GridLogic, [{
	    key: 'init',
	    value: function init(globalState) {
	      this.gridSize = globalState.state.gridSize || {};

	      // assume emptyTile is the last tile.
	      this.emptyTile = [this.gridSize - 1, this.gridSize - 1];
	      this.goalGrid = this._createGrid(this.gridSize);
	      this.shuffledGrid = this._shuffle(this.goalGrid.slice(), globalState.state.shuffleTimes);
	    }
	  }, {
	    key: '_createGrid',
	    value: function _createGrid(gridSize) {
	      var i,
	          j,
	          grid = [];

	      for (i = 0; i < gridSize; i++) {
	        for (j = 0; j < gridSize; j++) {
	          grid.push([j, i]);
	        }
	      }

	      // make last tile empty
	      grid.pop();

	      return grid;
	    }
	  }, {
	    key: '_shuffle',
	    value: function _shuffle(grid, times) {
	      var i = 0,
	          n = times;

	      for (; i < n; i++) {
	        // get next allowable moves
	        this.allowableMoves = this.getAllowableMoves(this.emptyTile, grid);

	        // console.log('ALLOWABLE', this.allowableMoves);

	        // randomly choose an allowable move
	        grid = this._moveToRandomTile(grid, this.allowableMoves);
	      }

	      return grid;
	    }
	  }, {
	    key: 'getAllowableMoves',
	    value: function getAllowableMoves(emptyTile, grid) {
	      var tile = 0,
	          n = grid.length,
	          allowableMoves = [];

	      var emptyCol = emptyTile[0],
	          emptyRow = emptyTile[1],
	          gridRow,
	          gridCol,
	          oneColAway,
	          oneRowAway,
	          direction,
	          horizontalOffset,
	          verticleOffset;

	      for (; tile < n; tile++) {
	        gridCol = grid[tile][0];
	        gridRow = grid[tile][1];
	        horizontalOffset = gridCol - emptyCol;
	        verticleOffset = gridRow - emptyRow;

	        // if the tile is on same row, and one col away
	        oneColAway = emptyRow === gridRow && Math.abs(horizontalOffset) === 1;
	        // if the tile is on col row, and one row away
	        oneRowAway = emptyCol === gridCol && Math.abs(verticleOffset) === 1;

	        if (oneColAway || oneRowAway) {
	          if (oneColAway) {
	            direction = this.getDirection(horizontalOffset, 'x');
	          }

	          if (oneRowAway) {
	            direction = this.getDirection(verticleOffset, 'y');
	          }

	          allowableMoves.push([grid[tile], direction, tile]);
	        }
	      }

	      return allowableMoves;
	    }
	  }, {
	    key: '_moveToRandomTile',
	    value: function _moveToRandomTile(grid, allowableMoves) {
	      var choice = allowableMoves[Math.floor(Math.random() * allowableMoves.length)],
	          direction = choice[1],
	          tile = choice[2],
	          fromPosition = grid[tile];

	      // keep track so we don't move back and cancel
	      // last move
	      this.lastDirection = direction;

	      // switch emptyTile and moved tile [x, y]
	      grid[tile] = this.emptyTile;
	      this.emptyTile = fromPosition;

	      // console.log('EMPTY?', this.emptyTile);

	      return grid;
	    }
	  }, {
	    key: 'getDirection',
	    value: function getDirection(offset, axis) {
	      var direction;

	      if (axis === 'y') {
	        if (offset === -1) {
	          direction = 'DOWN';
	        } else {
	          direction = 'UP';
	        }
	      } else if (axis === 'x') {
	        if (offset === -1) {
	          direction = 'RIGHT';
	        } else {
	          direction = 'LEFT';
	        }
	      }

	      return direction;
	    }
	  }, {
	    key: 'getOppositeDirection',
	    value: function getOppositeDirection() {
	      return {
	        'LEFT': 'RIGHT',
	        'UP': 'DOWN',
	        'RIGHT': 'LEFT',
	        'DOWN': 'UP'
	      };
	    }
	  }]);

	  return GridLogic;
	})();

	exports['default'] = GridLogic;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

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
	 * @class Solver
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Solver = (function () {
	  /*
	   * @constructs Solver
	   * @param {Object} state options
	   */

	  function Solver(globalState, gridLogic) {
	    _classCallCheck(this, Solver);

	    this.globalState = globalState;
	    this.state = globalState.state || {};
	    this.gridLogic = gridLogic;
	    this.solveButton = document.querySelector('.solve-button');
	    this.closedGrids = [];
	    this.emptyFringeTile; // TODO: should not be a property
	    this.solution = [];
	    this.steps = 0; // for testing/bailing after too long
	  }

	  _createClass(Solver, [{
	    key: 'init',
	    value: function init(state) {
	      this.openGrids = [{
	        'grid': state.grid,
	        'rank': 0,
	        'emptyTile': state.emptyTile,
	        'direction': 'none', // TODO: hope this doesn't break it
	        'tileMoved': 'none',
	        'tileMovedPosition': 'none',
	        'solution': []
	      }];
	    }
	  }, {
	    key: 'solve',
	    value: function solve(grid, goalGrid, emptyTile) {
	      var _this = this;

	      this.steps++;
	      // remove leftmost state and assign to candidate
	      var candidate = this.openGrids.shift();

	      if (this.steps > 3000) {
	        console.log('sad trombone', 'OPEN', this.openGrids, 'CLOSED', this.closedGrids);
	        return;
	      }

	      if (this.isSameArray(candidate.grid, this.state.goalGrid)) {
	        this.solution = candidate.solution;
	        console.log('WE DID IT IN ' + candidate.solution.length);
	        return;
	      }

	      // TODO this should be passed explicity
	      this.emptyFringeTile = emptyTile;

	      var candidates = this.makeFringe(emptyTile, candidate, goalGrid);
	      var isOnOpen, isOnClosed;

	      candidates.forEach(function (candidate) {
	        isOnClosed = _this.closedGrids.some(function (closedGrid) {
	          return _this.isSameArray(candidate.grid, closedGrid.grid);
	        });

	        isOnOpen = _this.openGrids.some(function (openGrid) {
	          return _this.isSameArray(candidate.grid, openGrid.grid);
	        });

	        // TODO, might be redundant with .every
	        if (isOnOpen) {
	          _this._cleanOpenGrids(candidate);
	        }

	        // throws a grid length error
	        // if (isOnClosed) {
	        //   this._cleanClosedGrids(candidate);
	        // }

	        // if the candidate is not on openGrids or ClosedGrids...
	        // most importantly so we don't do moves we've already done
	        if (!isOnOpen && !isOnClosed) {
	          _this.openGrids.push(candidate);
	        }
	      });

	      // sort by rank
	      this.openGrids = this._sort(this.openGrids.slice(), 'rank');

	      // move last candidate to closed
	      this.closedGrids.push(candidate);

	      // while openGrids still have stuff
	      if (this.openGrids.length !== 0) {
	        this.solve(this.openGrids[0].grid, goalGrid, this.openGrids[0].emptyTile);
	      }
	    }
	  }, {
	    key: 'makeFringe',
	    value: function makeFringe(emptyTile, candidate, goalGrid) {
	      var _this2 = this;

	      var grid = candidate.grid,
	          fringe = this.gridLogic.getAllowableMoves(emptyTile, grid),
	          rank,
	          solution = candidate.solution,
	          frontier = [];

	      // TODO maybe make whats returned from getAllowable a readable object
	      // direction = fringe[1]; is kinda obtuse
	      fringe.forEach(function (item) {
	        var fringed = _this2._makeGrid(item, grid.slice(), _this2.emptyFringeTile),
	            fringeGrid = fringed.grid,
	            emptyTile = fringed.emptyTile,
	            direction = item[1],
	            tileMoved = item[2],
	            tileMovedPosition = item[0];

	        rank = _this2._evaluation(fringeGrid, goalGrid, solution.length);

	        frontier.push({
	          'grid': fringeGrid,
	          'rank': rank,
	          'emptyTile': emptyTile,
	          'direction': direction,
	          'tileMoved': tileMoved,
	          'tileMovedPosition': tileMovedPosition,
	          'solution': _this2._addPath(tileMovedPosition, tileMoved, direction, solution)
	        });
	      });

	      return frontier;
	    }
	  }, {
	    key: '_addPath',
	    value: function _addPath(tileMovedPosition, tileMoved, direction, solution) {
	      var tile = [tileMovedPosition[0], tileMovedPosition[1], tileMoved],
	          path = {
	        'tile': tile,
	        'direction': direction
	      };

	      if (solution.length === 0) {

	        return [path];
	      } else {
	        var solutions = solution.slice();
	        solutions.push(path);

	        return solutions;
	      }
	    }
	  }, {
	    key: '_cleanOpenGrids',
	    value: function _cleanOpenGrids(candidate) {
	      var _this3 = this;

	      this.openGrids.forEach(function (openGrid) {
	        if (_this3.isSameArray(candidate.grid, openGrid.grid)) {
	          if (candidate.solution.length < openGrid.solution.length) {
	            // set the opengrid solution to shorter path
	            openGrid.solution = candidate.solution;
	          }
	        }
	      });
	    }
	  }, {
	    key: '_cleanClosedGrids',
	    value: function _cleanClosedGrids(candidate) {
	      var _this4 = this;

	      this.closedGrids.forEach(function (closedGrids, index) {
	        if (_this4.isSameArray(candidate.grid, closedGrids.grid)) {
	          if (candidate.solution.length < closedGrids.solution.length) {
	            // remove closedgrid from closed and put it on open
	            var makeItOpen = _this4.closedGrids.splice(index, 1);

	            _this4.openGrids.push(makeItOpen);
	          }
	        }
	      });
	    }
	  }, {
	    key: 'isSameArray',
	    value: function isSameArray(grid, targetGrid) {
	      return grid.length === targetGrid.length && grid.every(function (element, index) {
	        return element === targetGrid[index];
	      });
	    }

	    // returns a best guess underestimate of "closeness",
	    // of a grid to another grid "goal grid"
	  }, {
	    key: '_evaluation',
	    value: function _evaluation(grid, goalGrid, generation) {
	      return this._getDistance(grid, goalGrid) + generation;
	    }
	  }, {
	    key: '_getDistance',
	    value: function _getDistance(grid, goalGrid) {
	      var totalDistance = 0,
	          distance;

	      grid.forEach(function (tile, index) {
	        distance = Math.abs(tile[0] - goalGrid[index][0]) + Math.abs(tile[1] - goalGrid[index][1]);

	        // quick check for another hueristic,
	        // if the tile is identical to goalgrid tile
	        if (distance !== 0) {
	          totalDistance += 1;
	        }

	        totalDistance += distance;
	      });

	      return totalDistance;
	    }

	    // TODO should either be global or in gridLogic
	  }, {
	    key: '_makeGrid',
	    value: function _makeGrid(fringe, grid, emptyTile) {
	      var tile = fringe[2];

	      var fromPosition = grid[tile];
	      grid[tile] = emptyTile;

	      return {
	        'grid': grid,
	        'emptyTile': fromPosition
	      };
	    }
	  }, {
	    key: '_sort',
	    value: function _sort(array, key) {
	      return array.sort(function (a, b) {
	        return a[key] - b[key];
	      });
	    }
	  }]);

	  return Solver;
	})();

	exports['default'] = Solver;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	 * @class PuzzleSelect
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Modal = (function () {
	  function Modal(globalState) {
	    _classCallCheck(this, Modal);

	    this.state = globalState || {};
	    this.puzzleConfig = this.state.puzzleConfig, this.modal;

	    this._shuffles = [['yes', true], ['no', false]];
	  }

	  // TODO if modal is there then just html the contents, else create

	  _createClass(Modal, [{
	    key: '_render',
	    value: function _render(contents, type) {
	      var i,
	          puzzles,
	          section = document.createElement('section'),
	          html = contents;

	      section.setAttribute('class', 'modal open ' + type);
	      this.modal = section;
	      section.innerHTML = contents;
	      this.state.appElement.appendChild(section);
	    }
	  }, {
	    key: 'renderIntro',
	    value: function renderIntro() {
	      var _this = this;

	      var sizeMaps = this._getMap(this.puzzleConfig.size),
	          shuffleMaps = this._getMap(this.puzzleConfig.shuffle);

	      var html = '\n        <h1>Slider Puzzle!</h1>\n\n        <form>\n          <fieldset class="configure-puzzle">\n            <legend>configure your puzzle</legend>\n            <!--<p>\n              Hi there <input type="text" placeholder="' + this.puzzleConfig.player + '" />\n            </p>-->\n            <ul>\n              ' + sizeMaps.map(function (size) {
	        return '\n                <li>\n                  <input ' + _this._seeIfChecked(size, 'gridSize') + ' name="gridSize" type="radio" id="' + size.toString().split(',')[1] + '">\n                  <label for="' + size.toString().split(',')[1] + '">\n                    ' + size.toString().split(',')[0] + '\n                  </label>\n                </li>';
	      }).join('\n') + '\n            </ul>\n\n            <ul>\n              ' + shuffleMaps.map(function (shuffle) {
	        return '\n                <li>\n                  <input ' + _this._seeIfChecked(shuffle, 'shuffleTimes') + ' name="shuffleTimes" type="radio" id="' + shuffle.toString().split(',')[1] + '">\n                  <label for="' + shuffle.toString().split(',')[1] + '">\n                    ' + shuffle.toString().split(',')[0] + '\n                  </label>\n                </li>';
	      }).join('\n') + '\n            </ul>\n          </fieldset>\n\n          <button class="play modal-close" type="button">\n            Looks good to me\n          </button>\n        </form>\n    ';

	      this._render(html, 'intro');
	    }
	  }, {
	    key: '_seeIfChecked',
	    value: function _seeIfChecked(size, initValue) {
	      var matchesInit = size[0][1] === this.state[initValue];

	      return matchesInit ? 'checked=checked' : '';
	    }
	  }, {
	    key: '_getMap',
	    value: function _getMap(object) {
	      var i,
	          key,
	          map = [];

	      for (i = 0; i < object.length; i++) {
	        var item = object[i],
	            group = [];

	        for (key in item) {
	          group.push(item[key]);
	        }

	        map.push([group]);
	      }

	      return map;
	    }
	  }]);

	  return Modal;
	})();

	exports['default'] = Modal;
	module.exports = exports['default'];

/***/ }
/******/ ]);