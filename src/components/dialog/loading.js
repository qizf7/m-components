const Base = require('./base');
const appendToSelector = require('./utils').appendToSelector;
const langs = require('./langs').loading;
const prefix = 'mc-dialog-loading';

class Loading extends Base {
  static defaultOptions = {
    useMask: false,
    count: 12,
    lang: 'zh'
  }
  constructor(options){
    super();
    $.extend(this, Loading.defaultOptions, options);

    let html = '';
    for (let i = 0; i < this.count; i++) {
      html += '<i></i>';
    }

    this.container.className += ` ${prefix}`;
    this.container.innerHTML = `
      ${html}
      <p>${langs[this.lang].loadingText}</p>
    `;

  }

  show(options = {}) {
    if(!this.mounted) this.mount();
    super.show();
  }
}

module.exports = Loading;
