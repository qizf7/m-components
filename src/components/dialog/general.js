const Base =  require('./base');

const prefix = 'mc-dialog-general';

const tmpl = `
  <div class="dialog-content"><p class="dialog-content-text"></p></div>
  <div class="dialog-button-group"></div>
`;

class General extends Base {
  constructor(options = {}) {
    super(options);
    this.container.className += ` ${prefix}`;
    this.container.innerHTML = tmpl;
    this.content = this.container.querySelector('.dialog-content-text');
    this.buttonGroup = this.container.querySelector('.dialog-button-group');
  }
  show(options = {}) {
    this.contentHTML = options.contentHTML || this.contentHTML;
    this.content.innerHTML = this.contentHTML;
    super.show();
  }
}

module.exports = General;
