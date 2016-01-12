Configurable canvas puzzle that solves itself ╰(✿˙ᗜ˙)੭━☆ﾟ.*･｡ﾟ

I obviously had the most trouble with the solving algorithm. The sources that I based this off of were:

*https://www.youtube.com/watch?v=b19e0_NlD-U&t=438 That psuedocode helped a lot.
*https://en.wikipedia.org/wiki/A*_search_algorithm As a sanity check
*http://jamie-wong.com/2011/10/16/fifteen-puzzle-algorithm/ As another sanity check. He made me feel dumb.

###Getting started:

1. $ git clone https://github.com/choshun/slider-puzzle.git
2. $ npm install
3. $ npm start
4. $ npm run webpack-watch
5. go to http://localhost:4000/

###File Structure

*/src/client/
  *index.html - the page, has little; everything is driven by and rendered by a configuration object called app.state.
  *puzzle-core.scss - the css for the app.
  *puzzle-core.js - bootstrapper and point of truth for all logic in the app.
*/src/client/components
  I tried to make these only dependant on the app component, they don't call eachother and are only used in puzzle-core.
  *app.js - getter and setter of app.state, and global functions like app.getAllowableState (get fringe).
  *canvas.js - creates a responsive ui for the puzzle. Tried to make it work for any viewport and any uploaded image.
  *grid-logic.js - creates and shuffles the grid based on app.state.
  *modal.js - creates and adds modals for different interactions. These include winning, clicking solve, and the solver exploding.
  *puzzle-select - what creates the landing puzzle image selection. Images are in app.state
  *solver - solves the puzzle with the A* algorithm (I think).

###Hotsheet
*Before (wasn't really keeping track of day)
  *get es6 webpack seed up on local - DONE
  *create a shuffled grid
  *get allowable moves based on empty tile and grid
  *figure out how best to solve it - which took a while
  
*1/6/16
  *get canvas to move a tile - DONE!
  *translate e.pagex/y to tiles - DONE!
  *fire move on allowable tiles - DONE!
  *move to correct tile - DONE!
  *get grid to update, making it way easier to debug - DONE!
*1/7/16
  *when you hit solve button, and it's solved, have grid update to solved state - DONE
  *make each grid have it's history for open/closed grid path comparisons - DONE
  *when doing comparisons of tree candidate to closed and open grids...
   	*on closed - :(
    *on open - DONE
  *make sure solve doesn't fire until final tree is made - DONE
  *have solve be a worker - :(
*1/9/16
  *make responsive
    *center any uploaded image in canvas based on image size - DONE
    *center canvas element in center of page - DONE
    *if image is too big make tiles fit to 100% viewport - DONE
    *center image in smaller viewport -DONE
    *when resize repaint canvas - DONE
  *make a modal with inputs from app.state.puzzleConfig (intro modal) - DONE
*1/10/16
  *puzzle
    *retry button with presets - DONE,
    *fire when user gets to goal - DONE
    *hint button - DONE
  *modal
    *style modal/global elements - DONE
    *intro when you click a radio it drives the global state - DONE
    *When you hit looks good it closes on intro modal - DONE
    *show something when you hit solve "try again" - DONE
    *show something when you win "you did it in 5 moves!" -DONE
    *show something when solve borks - DONE
    *if solved or moved in 1 step/move say step/move not steps/moves - DONE

*1/11/16 TODO
  *close puzzle - :(
  *have all requestAnimation callbacks use same easing iteration function - :(
  *puzzle - finally do puzzle animation - DONE
  *readme - DONE
  *jsdocs
  *gjslint, csscomb... BOOM

###More features I want to do
*make solver.solve a worker, could help with call stack limits
*optimise solver
*save state
*share
*back button from puzzle solving state to choose puzzle
*upload image
*upload sound effects
*choose a bg song
*animations with canvas (I had big ideas before I realized the solving part was an ordeal).


