const Base =  require('./base');
const appendToSelector = require('./utils').appendToSelector;

const prefix = 'mc-dialog-loading';

let html = `
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
`

class Loading extends Base {
  static defaultOptions = {
    useMask: false
  }
  constructor(options){
    super();
    this.container.className += ` ${prefix}`;
    this.container.innerHTML = html;
  }

  show(options = {}) {
    if(!this.mounted) this.mount();
    $.extend(this, Loading.defaultOptions, options);
    super.show();
  }
}

module.exports = Loading;
