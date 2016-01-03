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

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _componentsGlobalState = __webpack_require__(1);

	var _componentsGlobalState2 = _interopRequireDefault(_componentsGlobalState);

	var _componentsCanvas = __webpack_require__(2);

	var _componentsCanvas2 = _interopRequireDefault(_componentsCanvas);

	var _componentsGridLogic = __webpack_require__(3);

	var _componentsGridLogic2 = _interopRequireDefault(_componentsGridLogic);

	var _componentsSolver = __webpack_require__(4);

	var _componentsSolver2 = _interopRequireDefault(_componentsSolver);

	__webpack_require__(5);

	(function () {
	  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	  var initialState = {
	    gridSize: 3,
	    shuffleTimes: 1,
	    canvas: [{
	      'image': '/images/sc4a.jpg',
	      'name': 'test1'
	    }]
	  };

	  var globalState = new _componentsGlobalState2['default'](initialState);
	  var gridLogic = new _componentsGridLogic2['default'](globalState);
	  var canvas = new _componentsCanvas2['default'](globalState, gridLogic);
	  var solver = new _componentsSolver2['default'](globalState, gridLogic, canvas);

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

	    this.globalState = globalState;
	    this.state = globalState.state || {};
	    this.appElement = document.getElementById('app');
	    this.canvas = this._createCanvas();
	    this.context = this.canvas.getContext('2d');
	    this.gridSize = this.state.gridSize;

	    // For animation
	    this._iteration = 0, this._totalIterations = 40;

	    this._width = this.canvas.offsetWidth, this._height = this.canvas.offsetHeight;
	    this._tileWidth = this._width / this.gridSize, this._tileHeight = this._height / this.gridSize;
	  }

	  // // HOLY SHIT THIS WORKS
	  // var canvas = document.querySelector("canvas"),
	  //     ctx = canvas.getContext("2d"),
	  //     w = canvas.width,
	  //     h = canvas.height;

	  // // Square-monkey object
	  // function Rectangle(ctx, x, y, w, h, color, speed) {

	  //   this.ctx = ctx;
	  //   this.x = x;
	  //   this.y = y;
	  //   this.height = h;
	  //   this.width = w;
	  //   this.color = color;

	  //   this.alpha = 0;                        // current alpha for this instance
	  //   this.speed = speed;                    // increment for alpha per frame
	  //   this.triggered = false;                // is running
	  //   this.done = false;                     // has finished
	  // }

	  // // prototype methods that will be shared
	  // Rectangle.prototype = {

	  //   trigger: function() {                  // start this rectangle
	  //     this.triggered = true
	  //   },

	  //   update: function() {
	  //     if (this.triggered && !this.done) {  // only if active
	  //       this.alpha += this.speed;          // update alpha
	  //       this.done = (this.alpha >= 1);     // update status
	  //     }

	  //     this.ctx.fillStyle = this.color;     // render this instance
	  //     this.ctx.globalAlpha = Math.min(1, this.alpha);

	  //     var t = this.ctx.globalAlpha,        // use current alpha as t
	  //         cx = this.x + this.width * 0.5,  // center position
	  //         cy = this.y + this.width * 0.5;

	  //     this.ctx.setTransform(t, 0, 0, t, cx, cy); // scale and translate
	  //     this.ctx.rotate(0.5 * Math.PI * (1 - t));  // rotate, 90° <- alpha
	  //     this.ctx.translate(-cx, -cy);              // translate back
	  //     this.ctx.fillRect(this.x, this.y, this.width, this.height);
	  //   } 
	  // };

	  // // Populate grid
	  // var cols = 20,
	  //     rows = 12,
	  //     cellWidth = canvas.width / cols,
	  //     cellHeight = canvas.height /rows,
	  //     grid = [],
	  //     len = cols * rows,
	  //     y = 0, x;

	  // for(; y < rows; y++) {
	  //   for(x = 0; x < cols; x++) {
	  //     grid.push(new Rectangle(ctx, x * cellWidth, y * cellHeight, cellWidth, cellHeight, "#79f", 0.02));
	  //   }
	  // }

	  // var index,
	  //     hasActive = true;

	  // x = 0;

	  // function loop() {

	  //   ctx.setTransform(1,0,0,1,0,0);
	  //   ctx.globalAlpha = 1;
	  //   ctx.clearRect(0, 0, w, h);

	  //   // trigger cells
	  //   for(y = 0; y < rows; y++) {
	  //     var gx = (x|0) - y;
	  //     if (gx >= 0 && gx < cols) {
	  //       index = y * cols + gx;
	  //       grid[index].trigger();
	  //     }
	  //   }

	  //   x += 0.333;

	  //   hasActive = false;

	  //   // update all
	  //   for(var i = 0; i < grid.length; i++) {
	  //     grid[i].update();
	  //     if (!grid[i].done) hasActive = true;
	  //   }

	  //   if (hasActive) requestAnimationFrame(loop)
	  // }

	  // loop();

	  // console.log('CANVAS STATE', app.state);

	  _createClass(Canvas, [{
	    key: 'init',
	    value: function init() {
	      // paint
	      this._loadImage('test');
	    }
	  }, {
	    key: '_createCanvas',
	    value: function _createCanvas() {
	      var canvas = document.createElement('canvas');
	      canvas.setAttribute('class', 'scene');
	      this.appElement.appendChild(canvas);

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
	  }, {
	    key: '_loadImage',
	    value: function _loadImage(image) {
	      var _this = this;

	      var imageObj = new Image();

	      imageObj.onload = function () {
	        var cover = _this._width > _this._height ? _this._width : _this._height;

	        _this.canvas.setAttribute('height', _this.canvas.offsetHeight);
	        _this.canvas.setAttribute('width', _this.canvas.offsetWidth);

	        console.log('WHAT I GOT TO WORK WITH', _this.state.grid);
	        _this._drawTiles(imageObj);
	      };

	      imageObj.src = this.state.canvas[0].image;
	    }
	  }, {
	    key: '_drawTiles',
	    value: function _drawTiles(imageObj) {
	      var i = 0,
	          j = 0,
	          count = 0;

	      this.context.font = "30px Helvetica";
	      this.context.fillStyle = "#ff00ff";

	      //this.context.fillText(count, 50, 50);

	      //this.context.drawImage(imageObj, this._tileWidth * placementX, this._tileHeight * placementY, this._tileWidth, this._tileHeight,  this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight);
	      for (j = 0; j < this.gridSize; j++) {
	        for (i = 0; i < this.gridSize; i++) {

	          if (count < this.state.grid.length) {
	            this.context.beginPath();
	            this.context.stroke();

	            var tile = this.state.grid[count],
	                placementX = tile[0],
	                placementY = tile[1];

	            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
	            // mask then placement
	            this.context.drawImage(imageObj, this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight, this._tileWidth * placementX, this._tileHeight * placementY, this._tileWidth, this._tileHeight);
	            this.context.fillText(count, this._tileWidth * placementX + 20, this._tileHeight * placementY + 20);
	            // this.context.clearRect(this._tileWidth * this.state.emptyTile[0], this._tileHeight * this.state.emptyTile[1], this._tileWidth, this._tileHeight);
	          }

	          // if (i === 1 && j === 1) {
	          //   this.context.drawImage(imageObj, 200, 300, this._tileWidth, this._tileHeight, this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight);
	          // } else if (i === 2 && j === 2) {
	          //   var easingValue = this._easeInOutQuad(this._iteration, 0, this._tileHeight, this._totalIterations);

	          //   // console.log('frame', easingValue, this._iteration);
	          //   this.context.closePath();
	          //   this.context.clearRect(this._tileWidth * i, this._tileHeight * j, 500, 500);

	          //   this.context.drawImage(imageObj, this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight,  this._tileWidth * i, this._tileHeight * j - easingValue, this._tileWidth, this._tileHeight);
	          // } else {
	          // this.context.drawImage(imageObj, this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight,  this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight);
	          // }

	          count++;
	        }
	      }

	      // if (this._iteration < this._totalIterations) {
	      //   this._iteration++;
	      //   requestAnimationFrame(() => this._drawTiles(imageObj))
	      // } else {
	      //   this._iteration = 0;
	      // }

	      this.context.fill();
	    }
	  }]);

	  return Canvas;
	})();

	exports['default'] = Canvas;
	module.exports = exports['default'];

/***/ },
/* 3 */
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

	  function GridLogic(globalState) {
	    _classCallCheck(this, GridLogic);

	    this.globalState = globalState || {};
	    this.state = globalState.state || {};

	    this.gridSize = this.state.gridSize || {};
	    this.goalGrid;
	    this.shuffledGrid;

	    // assume emptyTile is the last tile.
	    this.emptyTile = [this.gridSize - 1, this.gridSize - 1];
	    this.allowableMoves;
	    this.lastDirection;
	  }

	  _createClass(GridLogic, [{
	    key: 'init',
	    value: function init() {
	      this.goalGrid = this._createGrid(this.gridSize);
	      this.shuffledGrid = this._shuffle(this.goalGrid, this.state.shuffleTimes);
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

	          // if we just moved left, we don't want to move right
	          if (direction !== this.getOppositeDirection()[this.lastDirection]) {
	            // push to fringe
	            allowableMoves.push([grid[tile], direction, tile]);
	          }
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

	      // console.log('CHOICE?', choice);

	      // console.log('TILE?', tile);

	      // console.log('DIRECTION?', direction);

	      // keep track so we don't move back and cancel
	      // last move
	      this.lastDirection = direction;

	      // switch emptyTile and moved tile [x, y]
	      grid[tile] = this.emptyTile;
	      this.emptyTile = fromPosition;

	      console.log('EMPTY?', this.emptyTile);

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
/* 4 */
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
	 * @class Canvas
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Solver = (function () {

	  /*
	   * @constructs Canvas
	   * @param {Object} state options
	   */

	  function Solver(globalState, gridLogic) {
	    _classCallCheck(this, Solver);

	    this.globalState = globalState;
	    this.state = globalState.state || {};
	    this.gridLogic = gridLogic;
	  }

	  _createClass(Solver, [{
	    key: 'init',
	    value: function init() {
	      console.log('SOLVER INNIT', this);

	      this.solve(this.state.grid, this.state.goalGrid, this.state.emptyTile);
	    }
	  }, {
	    key: 'solve',
	    value: function solve(grid, goalGrid, emptyTile) {
	      console.log('TOOLS TO SOLVE', grid, goalGrid, emptyTile, 'GRID LOGIC?', this.gridLogic.getAllowableMoves(emptyTile, grid));
	      // get fringe with
	      // allowable moves
	      // then gridLogic.move(emptyTile, tile);
	      // then hueristics - generation + rectilinear + tiles out of place
	      // TODO - how will I trigger canvas move?
	      // compare then repeat
	    }
	  }]);

	  return Solver;
	})();

	var generation = 0;

	function getGeneration() {
	  return generation;
	}

	// function getDistance() {
	//   var origCol,
	//       origRow,
	//       _ref;

	//   _ref = originalPosition(num);
	//   origRow = _ref[0];
	//   origCol = _ref[1];

	//   return Math.abs(origRow - curRow) + Math.abs(origCol - curCol);
	// }

	//after loop
	generation++;

	exports['default'] = Solver;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);