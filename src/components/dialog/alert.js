const General = require('./general');

let prefix = 'mc-dialog-alert';

class AlertDialog extends General {
  static defaultOptions = {
    contentHTML: 'This is content!',
    buttonText: 'confirm',
    lang: 'zh',
    onConfirm: function () {this.hide()}
  }
  constructor(options) {
    super();
    $.extend(this, AlertDialog.defaultOptions, options);
    this.container.className += ` ${prefix}`;
    this.buttonGroup.innerHTML = `<button>${this.buttonText}</button>`;
    this.button = this.buttonGroup.querySelector('button');
    this.container.addEventListener('click', e => {
      if(e.target === this.button){
        this.onConfirm.call(this, () => {
          this.hide();
        })
      }
    }, false)
  }
}

module.exports = AlertDialog;
