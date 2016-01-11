/*
 * @class PuzzleSelect
 */
class Modal {
  constructor(globalState) {
    this.state = globalState || {};
    this.puzzleConfig = this.state.puzzleConfig,
    this.modal;

    this._shuffles = [ [ 'yes', true ], [ 'no', false ] ];
  }

  // TODO if modal is there then just html the contents, else create
  _render(contents, type) {
    var i,
        puzzles,
        section = document.createElement('section'),
        html = contents;

    section.setAttribute('class', 'modal open ' + type);
    this.modal = section;
    section.innerHTML = contents;
    this.state.appElement.appendChild(section);
  }

  renderIntro() {
    var sizeMaps = this._getMap(this.puzzleConfig.size),
        shuffleMaps = this._getMap(this.puzzleConfig.shuffle);

    var html = `
        <h1>Slider Puzzle!</h1>

        <form>
          <fieldset class="configure-puzzle">
            <legend>configure your puzzle</legend>
            <p>
              Hi there <input type="text" placeholder="${this.puzzleConfig.player}" />
            </p>
            <ul>
              ${sizeMaps.map(size => `
                <li>
                  <label for="${size.toString().split(',')[1]}">
                    ${size.toString().split(',')[0]}
                  </label>
                  <input ${this._seeIfChecked(size, 'gridSize')} name="gridSize" type="radio" id="${size.toString().split(',')[1]}">
                </li>`).join('\n')}
            </ul>

            <ul>
              ${shuffleMaps.map(shuffle => `
                <li>
                  <label for="${shuffle.toString().split(',')[1]}">
                    ${shuffle.toString().split(',')[0]}
                  </label>
                  <input ${this._seeIfChecked(shuffle, 'shuffleTimes')} name="shuffleTimes" type="radio" id="${shuffle.toString().split(',')[1]}">
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

  _seeIfChecked(size, initValue) {
    var matchesInit = (size[0][1] === this.state[initValue]);

    return (matchesInit) ? 'checked=checked' : '';
  }

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