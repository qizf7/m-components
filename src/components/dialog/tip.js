const Base =  require('./base');
const appendToSelector = require('./utils').appendToSelector;

const prefix = 'mc-dialog-tip';

class Tip extends Base {
  static defaultOptions = {
    contentHTML: 'This is content!',
    duration: 2000,
    useMask: false
  }
  constructor(options){
    super();
    $.extend(this, Tip.defaultOptions, options);
    this.container.className += ` ${prefix}`;
    this.container.innerHTML = '<p class="dialog-content-text"></p>';
    this.content = this.container.querySelector('.dialog-content-text');
  }
  show(options = {}) {
    if(!this.mounted) this.mount();
    this.contentHTML = options.contentHTML || this.contentHTML;
    this.content.innerHTML = this.contentHTML;
    super.show();
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.hide();
    }, options.duration || this.duration)
  }
}

module.exports = Tip;
