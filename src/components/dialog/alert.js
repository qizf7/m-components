const General = require('./general');

class AlertDialog extends General {
  static defaultOptions = {
    contentHTML: 'This is content!',
    buttonText: 'confirm',
    onConfirm: function () {this.hide()}
  }
  constructor(options) {
    super();
    $.extend(this, AlertDialog.defaultOptions, options);
    this.container.className += ' alert-dialog';
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
