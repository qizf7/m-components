const Base =  require('./base');

const tmpl = `
  <div class="dialog-content"><p class="dialog-content-text"></p></div>
  <div class="dialog-button-group"></div>
`;

class General extends Base {
  constructor() {
    super();
    this.container.className += ' general-dialog';
    this.container.innerHTML = tmpl;
    this.content = this.container.querySelector('.dialog-content-text');
    this.buttonGroup = this.container.querySelector('.dialog-button-group');
  }
  show(options = {}) {
    if(!this.mounted) this.mount();
    this.contentHTML = options.contentHTML || this.contentHTML;
    this.content.innerHTML = this.contentHTML;
    super.show();
  }
}

module.exports = General;
