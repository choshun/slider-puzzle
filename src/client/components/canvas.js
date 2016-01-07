/*
 * @class Canvas
 */
class Canvas {

  /*
   * @constructs Canvas
   * @param {Object} state options
   */
  constructor(globalState) {
    this.globalState = globalState;
    this.state = globalState.state || {};
    this.appElement = document.getElementById('app');
    this.canvas = this._createCanvas();
    this.context = this.canvas.getContext('2d');
    this.gridSize = this.state.gridSize;
    this.imageObj;

    // For animation
    this._iteration = 0,
    this._totalIterations = 20;

    this._width = this.canvas.offsetWidth,
    this._height = this.canvas.offsetHeight;
    this._tileWidth = this._width / this.gridSize,
    this._tileHeight = this._height / this.gridSize;
  }

  init() {
    // paint 
    this._loadImage('test');
  }

  moveTile(event) {
    var offsetX = event.layerX - this.canvas.offsetLeft,
        offsetY = event.layerY - this.canvas.offsetTop;

    var tile = this.getTile(offsetX, offsetY);

    this._drawTiles(this.imageObj, true, tile);
  }

  getTile(offsetX, offsetY) {
    var left = Math.floor(offsetX / this._tileWidth),
        top = Math.floor(offsetY / this._tileHeight);

    var origTile = this._findArraysIndex(this.state.grid, [left, top]);

    // console.log('TOP', top, 'LEFT', left, 'ORIGTILE', origTile, [left, top]);

    return [left, top, origTile]; // return tile for grid logic, top and left for canvas
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

  _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'scene');
    this.appElement.appendChild(canvas);

    return canvas;
  }

  _easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }
    return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
  }

  _loadImage(image) {
    this.imageObj = new Image();

    this.imageObj.onload = () => {
      var cover = this._width > this._height ? this._width : this._height;

      this.canvas.setAttribute('height', this.canvas.offsetHeight);
      this.canvas.setAttribute('width', this.canvas.offsetWidth);

      // console.log('WHAT I GOT TO WORK WITH', this.state.grid);
      this._drawTiles(this.imageObj, false);
    };

    this.imageObj.src = this.state.canvas[0].image;
  }

  _drawTiles(imageObj, draw, selectedTile) {
    var i = 0,
        j = 0,
        count = 0;

    // console.log('selected tile not undefined?', selectedTile, 'POSITION', position);

    this.context.font = "30px Helvetica";
    this.context.fillStyle = "#ff00ff";

    //this.context.drawImage(imageObj, this._tileWidth * placementX, this._tileHeight * placementY, this._tileWidth, this._tileHeight,  this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight);
    for (j = 0; j < this.gridSize; j++) {
      for (i = 0; i < this.gridSize; i++) {
        var tile,
            placementX,
            placementY,
            originalX,
            originalY;


        if (count < this.state.grid.length) {
          this.context.beginPath();
          this.context.stroke();
          
          // tile[0] is upperleft tile, it contains it's x, y in grid. 
          // Could be shuffled, ie tile[0] is [1, 1], which means the upperleft part 
          // of the original pic is now at 1 tile to the right, 1 tile down 
          tile = this.state.grid[count];
          placementX = tile[0];
          placementY = tile[1];
          
          // this keeps track of the original offset for the bg's when moving.
          // if I click [1, 1], I need to know what the mask originally was,
          // so if I clock tile[0] (upper left orginally), but it's at [2, 2], 
          // I need the moving tile at 2, 2, to have a bg offset of 0, 0
          originalX = i;
          originalY = j;

          // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
          // mask then placement
          // if (selectedTile !== true) {
            this.context.drawImage(this.imageObj,
                                  this._tileWidth * i, // tile bg position x
                                  this._tileHeight * j, // tile bg position y
                                  this._tileWidth,
                                  this._tileHeight,
                                  this._tileWidth * placementX, // tile position x
                                  this._tileHeight * placementY, // tile position y
                                  this._tileWidth, this._tileHeight);
            
          //}
          
          

        }

        // new function here called move, or redraw moved tile
        var position = selectedTile !== undefined ? selectedTile : false;
          if (selectedTile !== undefined && i === position[0] && j === position[1]) {
            var easingValue = this._easeInOutQuad(this._iteration, 0, this._tileHeight, this._totalIterations);

            // console.log('frame', easingValue, this._iteration);
            this.context.closePath();

            // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.clearRect(this._tileWidth * position[0],
                                  this._tileHeight * position[1],
                                  this._tileWidth,
                                  this._tileHeight);

            console.log('origTile?', position[2], 'position?', position[0], position[1], 'TILE?', tile, 'shuffled grid?', this.state.grid);


            this.context.drawImage(this.imageObj,
                                  this._tileWidth * this.state.goalGrid[position[2]][0], // tile bg position x
                                  this._tileHeight * this.state.goalGrid[position[2]][1], // tile bg position y
                                  this._tileWidth,
                                  this._tileHeight,
                                  this._tileWidth * position[0], // tile position x
                                  this._tileHeight * position[1] - easingValue, // tile position x
                                  this._tileWidth,
                                  this._tileHeight);
          } 
        
        
        this.context.fillText(count, this._tileWidth * placementX + 20, this._tileHeight * placementY + 20);

        count++;
      }
    }

    if (this._iteration < this._totalIterations) {
      this._iteration++;
      requestAnimationFrame(() => this._drawTiles(this.imageObj, draw, selectedTile));
    } else {
      this._iteration = 0;
    }

    this.context.fill();
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

