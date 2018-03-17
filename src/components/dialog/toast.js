const Base =  require('./base');
const appendToSelector = require('./utils').appendToSelector;

const prefix = 'mc-dialog-toast';

class Toast extends Base {
  static defaultOptions = {
    contentHTML: 'This is content!',
    duration: 2000
  }
  constructor(options){
    super();
    $.extend(this, Toast.defaultOptions, options);
    this.container.className += ` ${prefix}`;
    this.container.innerHTML = '<p class="dialog-content-text"></p>';
    this.content = this.container.querySelector('.dialog-content-text');
  }
  show(options = {}) {
    if(!this.mounted) this.mount();
    this.contentHTML = options.contentHTML || this.contentHTML;
    this.content.innerHTML = this.contentHTML;
    super.show();
    this.timerId = setTimeout(() => {
      this.hide();
    }, options.duration || this.duration)
  }
}

module.exports = Toast;
