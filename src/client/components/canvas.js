/*
 * @class Canvas
 */
class Canvas {

  /*
   * @constructs Canvas
   * @param {Object} state options
   */
  constructor(globalState) {
    this.state = globalState.state || {};

    // Canvas stuff
    this.canvas;
    this.context;
    this.imageObj;
    this.selectedImage;

    // For animation
    this._iteration = 0,
    this._totalIterations = 10;

    // For canvas grid
    this.gridSize

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

  init(globalObject, selectedImage) {
    this.gridSize = globalObject.state.gridSize;
    this.canvas = this._createCanvas();
    this.context = this.canvas.getContext('2d');

    // paint 
    this.selectedImage = selectedImage || this.selectedImage;
    this._loadImage(this.selectedImage);
  }

  moveTile(event, moves) {
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

  redrawMovedTile(selectedTile, nextMove) {
    var easingValue,
        direction = nextMove, // TODO kinda jenky
        easingY = 0,
        easingX = 0;

    if (direction === 'UP' || direction === 'DOWN') {
      easingValue = this._easeInOutQuad(
          this._iteration,
          0,
          this._tileHeight,
          this._totalIterations
      );

      easingY = this._directionLookup[direction] * easingValue;
    } else {
      easingValue = this._easeInOutQuad(
          this._iteration,
          0,
          this._tileWidth,
          this._totalIterations
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

    if (this._iteration < this._totalIterations) {
      this._iteration++;
      requestAnimationFrame(() => this.redrawMovedTile(selectedTile, nextMove));
    } else {
      this._iteration = 0;
    }
  }

  // TODO, for resize I may wanna not have imageWidth/appwidth stuff in here,
  // have as seperate function
  _loadImage(selectedImage) {
    this.imageObj = new Image();

    this.imageObj.onload = () => {

      var cover = this._width > this._height ? this._width : this._height,
          image = this.imageObj,
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

      console.log('canvas gridSize', this.gridSize);
      this._tileHeight = this._height / this.gridSize;

      this.canvas.setAttribute('height', this._height);
      this.canvas.setAttribute('width', this._width);
      this._drawTiles(offsetY, offsetX);
    };

    this.imageObj.src = selectedImage;
  }

  _drawTiles(offsetY, offsetX) {
    var i = 0,
        j = 0,
        count = 0;

    // this.context.font = "30px Helvetica";
    // this.context.fillStyle = "#ff00ff";

    // TODO: maybe do before passed,
    // but it messes up canvas centering first try
    this._bgOffsetX = (offsetX < 0) ? offsetX : 0,
    this._bgOffsetY = (offsetY < 0) ? offsetY : 0;

    for (j = 0; j < this.gridSize; j++) {
      for (i = 0; i < this.gridSize; i++) {
        var tile,
            placementX,
            placementY;

        if (count < this.state.grid.length) {
          this.context.beginPath();
          this.context.stroke();
          
          // tile[0] is upperleft tile, it contains it's x, y in grid. 
          // Could be shuffled, ie tile[0] is [1, 1], which means the upperleft part 
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
        
        // this.context.fillText(count, this._tileWidth * placementX + 20, this._tileHeight * placementY + 20);

        count++;
      }
    }

    this.context.fill();
  }

  _getTile(offsetX, offsetY) {
    var left = Math.floor(offsetX / this._tileWidth),
        top = Math.floor(offsetY / this._tileHeight);

    var origTile = this._findArraysIndex(this.state.grid, [left, top]);

    return [left, top, origTile]; //return tile for grid logic, top and left for canvas
  }

  _findArraysIndex(arrays, array){
    var i = 0,
        n = arrays.length;

    for (; i < n; i++) {
      if (array[0] === arrays[i][0] && array[1] === arrays[i][1]) {
        return i;
      }
    }

    return -1;
  }

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

  _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'scene');
    this.state.appElement.appendChild(canvas);

    return canvas;
  }

  _easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }
    return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
  }
}

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

export default Canvas;

