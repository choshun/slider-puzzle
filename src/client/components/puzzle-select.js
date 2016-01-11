/*
 * @class PuzzleSelect
 */
class PuzzleSelect {
  constructor(globalState) {

    this.state = globalState.state || {};
    this.puzzles = [];
    this.selectedPuzzle;
    this._images = this._getImages(this.state.canvas);
  }

  render() {
    var i,
        puzzles,
        section = document.createElement('section'),
        html = `
            <ul class="puzzle-list">
              ${this._images.map(image => `
                <li class="puzzle" style="background-image:url(${image})" id="${image}">
                </li>`).join('\n')}
            </ul>
        `;

    section.setAttribute('class', 'select-puzzle');
    section.innerHTML = html;
    this.state.appElement.appendChild(section);    
  }

  _getImages(canvasImages) {
    var i,
        images = [];

    for (i = 0; i < canvasImages.length; i++) {
      images.push(canvasImages[i].image);
    }

    return images
  }
}

export default PuzzleSelect;