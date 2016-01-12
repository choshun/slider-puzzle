/**
 * @class Modal
 *
 * Template maker for modals
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
class Modal {
  constructor(globalState) {
    this.state = globalState.state || {};
    this.puzzleConfig = this.state.puzzleConfig;
    this.modal;
  }

  /**
   * Puts modal on page.
   * @param {String} contents html to inject.
   * @param {String} type type of modal.
   */
  _render(contents, type) {
    if (this.modal === undefined) {
      this.modal = document.createElement('section');
    }

    this.modal.setAttribute('class', 'modal _open ' + type);
    this.modal.innerHTML = contents;
    this.state.appElement.appendChild(this.modal);
  }

  /**
   * Puts "you won!" modal on page.
   * @param {Number} steps steps it took for you to totes pwn.
   */
  renderWinning(steps) {
    var html = `
      <h1>A winner is you!</h1>

      <p>You did it in an astonishing ${steps} ${steps > 1 ? 'steps' : 'step'}.</p>

      <p>Try again?!?!?</p>

      <button id="retry" class="button retry-button in-modal">RETRY</button>
    `;

    this._render(html, 'modal-solved');
  }

  /**
   * Puts solved for you modal on page.
   * @param {Number} solutionLength steps it took for solver to solve.
   */
  renderSolved(solutionLength) {
    var html = `
      <h1>You were so close!</h1>

      <p>It took us ${solutionLength} ${solutionLength > 1 ? 'moves' : 'move'} to solve</p>

      <p>Try again?!?!?</p>

      <button id="retry" class="button retry-button in-modal">RETRY</button>
    `;

    this._render(html, 'modal-solved');
  }

  /**
   * When solver.solve dies.
   */
  renderError() {
    var html = `
      <h1>Uh oh, it seems you broke me - good job!</h1>

      <p>Try again?!?!?</p>

      <button id="retry" class="button retry-button in-modal">RETRY</button>
    `;

    this._render(html, 'modal-solved');
  }

  /**
   * Render configuration modal for your puzzles
   */
  renderIntro() {
    var sizeMaps = this._getMap(this.puzzleConfig.size),
        shuffleMaps = this._getMap(this.puzzleConfig.shuffle);

    var html = `
        <h1>Slider Puzzle!</h1>

        <form>
          <fieldset class="configure-puzzle">
            <legend>configure your puzzle</legend>
            <!--<p>
              Hi there <input type="text" placeholder="${this.puzzleConfig.player}" />
            </p>-->
            <ul>
              ${sizeMaps.map(size => `
                <li>
                  <input ${this._seeIfChecked(size, 'gridSize')} name="gridSize" type="radio" id="${size.toString().split(',')[1]}">
                  <label for="${size.toString().split(',')[1]}">
                    ${size.toString().split(',')[0]}
                  </label>
                </li>`).join('\n')}
            </ul>

            <ul>
              ${shuffleMaps.map(shuffle => `
                <li>
                  <input ${this._seeIfChecked(shuffle, 'shuffleTimes')} name="shuffleTimes" type="radio" id="${shuffle.toString().split(',')[1]}">
                  <label for="${shuffle.toString().split(',')[1]}">
                    ${shuffle.toString().split(',')[0]}
                  </label>
                </li>`).join('\n')}
            </ul>
          </fieldset>

          <button class="play modal-close" type="button">
            Looks good to me
          </button>
        </form>
    `;

    this._render(html, 'intro');
  }

  /**
   * Sees if template field matches init state value.
   * @param {Map} item config items
   * @param {String} initValue initial value key to check
   */
  _seeIfChecked(item, initValue) {
    var matchesInit = (item[0][1] === this.state[initValue]);

    return (matchesInit) ? 'checked=checked' : '';
  }

  /**
   * Creates an array that gets coerced into a map for looping
   * @param {Object} object object I'm "mapping"
   */
  _getMap(object) {
    var i,
        key,
        map = [];

    for (i = 0; i < object.length; i++) {
      var item = object[i],
          group = [];

      for (key in item) {
        group.push(item[key])
      }

      map.push([group]);
    }

    return map;
  }
}

export default Modal;