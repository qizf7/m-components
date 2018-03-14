const Base =  require('./base');
const appendToSelector = require('./utils').appendToSelector;

class Toast extends Base {
  static defaultOptions = {
    contentHTML: 'This is content!',
    time: 2000
  }
  constructor(options){
    super();
    Object.assign(this, Toast.defaultOptions, options);
    this.container.className += ' toast-dialog';
    this.container.innerHTML = '<p class="dialog-content-text"></p>';
    this.content = this.container.querySelector('.dialog-content-text');
  }
  show(content) {
    if(!this.mounted) this.mount();
    this.contentHTML = content || this.contentHTML;
    this.content.innerHTML = this.contentHTML;
    super.show();
    this.timerId = setTimeout(() => {
      this.hide();
    }, this.time)
  }
}

module.exports = Toast;
