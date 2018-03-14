const General = require('./general');

class ConfirmDialog extends General {
  static defaultOptions = {
    contentHTML: 'This is content!',
    confirmButtonText: 'confirm',
    cancelButtonText: 'cancel',
    onConfirm: function () {this.hide()},
    onCancel: function () {this.hide()}
  }
  constructor(options) {
    super(options);
    Object.assign(this, ConfirmDialog.defaultOptions, options);
    this.container.className += ' confirm-dialog';
    this.buttonGroup.innerHTML = `
      <button class="cancel-btn">${this.cancelButtonText}</button>
      <button class="confirm-btn">${this.confirmButtonText}</button>
    `;
    this.confirmBtn = this.buttonGroup.querySelector('.confirm-btn');
    this.cancelBtn = this.buttonGroup.querySelector('.cancel-btn');
    this.container.addEventListener('click', e => {
      if(e.target === this.confirmBtn){
        this.onConfirm.call(this, () => {
          this.hide();
        })
      }else if(e.target === this.cancelBtn){
        this.onCancel.call(this, () => {
          this.hide();
        })
      }
    }, false);
  }
}

module.exports = ConfirmDialog;
