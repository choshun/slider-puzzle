/**
 * @class PuzzleSelect
 *
 * Template maker for puzzle choose
 *
 * @author choshun.snyder@gmail.com (Choshun Snyder)
 */
class PuzzleSelect {
  constructor(globalState) {

    this.state = globalState.state || {};
    this.puzzles = [];
    this.selectedPuzzle;
    this._images = this._getImages(this.state.canvas);
  }

  /**
   * Puts puzzle images on page.
   */
  render() {
    var section = document.createElement('section'),
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

  /**
   * Gets canvas images from app.state.
   * @param {Object} canvasImages canvasImages
   */
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