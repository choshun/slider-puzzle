/**
 * @class Canvas
 *
 * Handles the puzzle ui, is reponsive, and can
 * handle any sized image.
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
class Canvas {

  /*
   * @constructs Canvas
   *
   * Has dimension and animation properties.
   * A lot of this is set at init/resize
   * based on what puzzle presets you choose.
   *
   * @param {Object} app global app
   */
  constructor(app) {
    this.app = app || {};
    this.state = app.state || {};

    // Canvas stuff
    this.canvas;
    this.context;
    this.imageObj;
    this.selectedImage;

    // For animation
    this._moveIteration = 0,
    this._totalMoveIterations = 10;
    this._tilesIteration = 0,
    this._totalTilesIterations = 100;

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
      'UP': - 1,
      'DOWN': + 1,
      'LEFT': - 1,
      'RIGHT': + 1,
    };
  }

  /**
   * Bootstraps canvas.
   * @param {Object} app global app.
   * @param {String} selectedImage absolute path
   *  to puzzle image.
   */
  init(app, selectedImage) {
    this.gridSize = app.state.gridSize;
    this.canvas = this._createCanvas();
    this.context = this.canvas.getContext('2d');

    // paint
    this.selectedImage = selectedImage || this.selectedImage;
    this._loadImage(this.selectedImage);
  }

  /**
   * Tells canvas what tile is clicked based on click event.
   * @param {Object} event click event.
   * @param {Array} moves an array of allowable moves
   *  (see app.getAllowableMoves).
   *  to puzzle image.
   *
   * @return {Boolean|Array} nextMove is either "false" if
   *  tile clicked is not valid,
   *  or one of those allowable move arrays
   *  (see app.getAllowableMoves)
   */
  moveTile(event, moves) {
    var offsetX = event.layerX,
        offsetY = event.layerY;

    var tile = this._getTile(offsetX, offsetY);
    var nextMove = this._getValidMove(tile, moves);

    if (nextMove !== false) {
      // tile is [left, top, origTile],
      // done this way for solver.solution solution animation
      this.redrawMovedTile(tile, nextMove[1]);
    }

    return nextMove;
  }

  /**
   * Does tile animation.
   * @param {Array} selectedTile [left, top, originalTilePosition].
   * @param {String} nextMove ie 'UP'
   */
  redrawMovedTile(selectedTile, nextMove) {
    var easingValue,
        direction = nextMove, // TODO kinda jenky
        easingY = 0,
        easingX = 0;

    // TODO could this be DRYer?
    if (direction === 'UP' || direction === 'DOWN') {
      easingValue = this._easeInOutQuad(
          this._moveIteration,
          0,
          this._tileHeight,
          this._totalMoveIterations
          );

      easingY = this._directionLookup[direction] * easingValue;
    } else {
      easingValue = this._easeInOutQuad(
          this._moveIteration,
          0,
          this._tileWidth,
          this._totalMoveIterations
          );

      easingX = this._directionLookup[direction] * easingValue;
    }

    this.context.closePath();

    this.context.clearRect(
        this._tileWidth * selectedTile[0],
        this._tileHeight * selectedTile[1],
        this._tileWidth,
        this._tileHeight);

    this.context.drawImage(
        this.imageObj,
        (this._tileWidth * this.state.goalGrid[selectedTile[2]][0]) -
        this._bgOffsetX, // tile bg position x
        (this._tileHeight * this.state.goalGrid[selectedTile[2]][1]) -
        this._bgOffsetY, // tile bg position y
        this._tileWidth,
        this._tileHeight,
        this._tileWidth * selectedTile[0] + easingX, // tile position X
        this._tileHeight * selectedTile[1] + easingY, // tile position Y
        this._tileWidth,
        this._tileHeight);

    // TODO makefunction, don'thave iterations, and total be a property
    // this.drawFrame(this.redrawMovedTile, selectedTile, nextMove)
    if (this._moveIteration < this._totalMoveIterations) {
      this._moveIteration++;
      requestAnimationFrame(() => this.redrawMovedTile(selectedTile, nextMove));
    } else {
      this._moveIteration = 0;
    }
  }

  // Well this doesn't work
  drawFrame(callback, ...drawParams) {
    if (this._iteration < this._totalIterations) {
      this._iteration++;

      requestAnimationFrame(() => callback(...drawParams));
    } else {
      this._iteration = 0;
    }
  }

  /**
   * Draws the slider puzzle.
   * @param {Number} offsetY offsetY of the canvas to viewport
   * @param {Number} offsetX offsetX of the canvas to viewport
   */
  _drawTiles(offsetY, offsetX) {
    var i = 0,
        j = 0,
        count = 0;

    this.context.globalAlpha = 1;
    this.context.save();

    var easingValue = this._easeInOutQuad(
        this._tilesIteration,
        0,
        1,
        this._totalTilesIterations
        );

    // TODO: maybe do before passed,
    // but it messes up canvas centering first try
    this._bgOffsetX = (offsetX < 0) ? offsetX : 0,
    this._bgOffsetY = (offsetY < 0) ? offsetY : 0;

    for (j = 0; j < this.gridSize; j++) {
      for (i = 0; i < this.gridSize; i++) {
        var thisAlpha = (j === 0 && i === 0) ?
            (1 / 1.5 + 1 / 1.5) : (i / 2.5 + j / 2.5);
        this.context.globalAlpha = thisAlpha * easingValue;

        var tile,
            placementX,
            placementY;

        if (count < this.state.grid.length) {
          this.context.beginPath();
          this.context.stroke();

          // tile[0] is upperleft tile, it contains it's x, y in grid.
          // Could be shuffled, ie tile[0] is [1, 1],
          // which means the upperleft part
          // of the original pic is now at 1 tile to the right, 1 tile down
          tile = this.state.grid[count];
          placementX = tile[0];
          placementY = tile[1];

          this.context.drawImage(
              this.imageObj,
              (this._tileWidth * i) - this._bgOffsetX, // tile bg position x
              (this._tileHeight * j) - this._bgOffsetY, // tile bg position y
              this._tileWidth,
              this._tileHeight,
              this._tileWidth * placementX, // tile position x
              this._tileHeight * placementY, // tile position y
              this._tileWidth, this._tileHeight);
        }

        count++;
      }
    }

    this.context.restore();

    // TODO make function
    if (this._tilesIteration < this._totalTilesIterations) {
      this._tilesIteration++;
      requestAnimationFrame(() => this._drawTiles(offsetY, offsetX));
    } else {
      this._tilesIteration = 0;
    }
  }

  /**
   * Gets the tile clicked associated with its original position.
   * @param {Number} offsetY offsetY of the canvas to viewport
   * @param {Number} offsetX offsetX of the canvas to viewport
   *
   * @return {Array} tile to be moved
   */
  _getTile(offsetX, offsetY) {
    var left = Math.floor(offsetX / this._tileWidth),
        top = Math.floor(offsetY / this._tileHeight);

    // matches clicked tile with its original position
    var origTile = this._findArraysIndex(this.state.grid, [left, top]);

    //return origTile for grid logic, top and left for canvas
    return [left, top, origTile];
  }

  /**
   * Basically an array.indexOf if you're finding
   * the index of an array in an array.
   * @param {Array} arrays arrays to find an array in
   * @param {Array} array array you're looking for
   *
   * @return {Array} tile to be moved
   */
  _findArraysIndex(arrays, array) {
    var i = 0,
        n = arrays.length;

    for (; i < n; i++) {
      if (array[0] === arrays[i][0] && array[1] === arrays[i][1]) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Used for canvas.moveTile,
   * @param {Array} tile tile to be moved
   *  (see canvas.getTile)
   * @param {Array} moves allowable moves
   *  (see app.getAllowableMoves)
   *
   * @return {Boolean|Array} nextMove is either "false" if
   *  tile clicked is not valid,
   *  or one of those allowable move arrays
   *  (see app.getAllowableMoves)
   */
  _getValidMove(tile, moves) {
    var tiledMoved = tile[2],
        validTile,
        nextMove = false;

    moves.forEach((move) => {
      validTile = move[2];

      if (tiledMoved === validTile) {
        nextMove = move;
        return;
      }
    });

    return nextMove;
  }

  /**
   * Creates a canvas and appends it to the app.
   *
   * @return {Object} canvas canvas object
   */
  _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'scene');
    this.state.appElement.appendChild(canvas);

    return canvas;
  }

  /**
   * Returns an easing number to use for animations.
   * @param {Number} currentIteration currentIteration, what you pass
   *  in as you increment with rframe
   * @param {Number} startValue
   * @param {Number} changeInValue end value you want
   * @param {Number} totalIterations so assuming 60fps, 60 would give
   *  you an animation that was 1s
   *
   * @return {Number} easing number
   */
  _easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }
    return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
  }

  /**
   * Loads an image, sets properties and kicks off
   *  drawpuzzle on callback.
   * @param {String} selectedImage puzzle image absolute path
   */
  _loadImage(selectedImage) {
    this.imageObj = new Image();

    this.imageObj.onload = () => {
      var image = this.imageObj,
          imageWidth = image.width,
          imageHeight = image.height,
          appElement = this.state.appElement,
          smallX = appElement.offsetWidth < imageWidth,
          smallY = appElement.offsetHeight < imageHeight,
          offsetY = (appElement.offsetHeight - imageHeight) / 2,
          offsetX = (appElement.offsetWidth - imageWidth) / 2;

      if (smallX) {
        this.canvas.classList.add('small-x');
        // kinda jenky, adding small-x makes it position: fixed,
        // left: 0. Flex box no longer works, adding the offset
        this.canvas.style.top = (!smallY) ? offsetY + 'px' : 0;
      } else {
        this.canvas.classList.remove('small-x');
        this.canvas.style.top = 'auto';
      }

      this._width = (smallX) ? appElement.offsetWidth : imageWidth;
      this._height = (smallY) ? appElement.offsetHeight : imageHeight;
      this._tileWidth = this._width / this.gridSize;
      this._tileHeight = this._height / this.gridSize;
      this.canvas.setAttribute('height', this._height);
      this.canvas.setAttribute('width', this._width);
      this._drawTiles(offsetY, offsetX);
    };

    this.imageObj.src = selectedImage;
  }
}

export default Canvas;
