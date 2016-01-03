/*
 * @class GlobalState
 */
class GlobalState {
  
  /*
   * @constructs App
   * @param {Object} options
   */
  constructor(state) {
    this.state = state || {};
    console.log('state!!', this.state);
  }

  set(state) {
    this.state = state;
  }

  setProperty(key, value) {
    this.state[key] = value;
  }

  get() {
    return this.state;
  }

  test() {
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
}

export default GlobalState;