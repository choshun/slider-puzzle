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
    
    // For animation
    this._iteration = 0,
    this._totalIterations = 40;

    this._width = this.canvas.offsetWidth,
    this._height = this.canvas.offsetHeight;
    this._tileWidth = this._width / this.gridSize,
    this._tileHeight = this._height / this.gridSize;
  }

  init() {
    // paint 
    this._loadImage('test');
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
    var imageObj = new Image();

    imageObj.onload = () => {
      var cover = this._width > this._height ? this._width : this._height;

      this.canvas.setAttribute('height', this.canvas.offsetHeight);
      this.canvas.setAttribute('width', this.canvas.offsetWidth);

      console.log('WHAT I GOT TO WORK WITH', this.state.grid);
      this._drawTiles(imageObj);
    };

    imageObj.src = this.state.canvas[0].image;
  }

  _drawTiles(imageObj) {
    var i = 0,
        j = 0,
        count = 0;

    this.context.font="30px Helvetica";
    this.context.fillStyle="#ff00ff";

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
          this.context.drawImage(imageObj, this._tileWidth * i, this._tileHeight * j, this._tileWidth, this._tileHeight,  this._tileWidth * placementX, this._tileHeight * placementY, this._tileWidth, this._tileHeight);
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

export default Canvas;

