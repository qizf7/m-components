const General = require('./general');

const prefix = 'mc-dialog-complex';

class Complex extends General {
  static defaultOptions = {
    contentHTML: 'This is content!',
    buttons: [
      {
        className: 'cancel',
        text: 'cancel',
        onClick: function () {this.hide()},
      }
    ]
  }
  constructor(options = {}) {
    super(options);
    $.extend(this, Complex.defaultOptions, options);
    this.container.className += ` ${prefix}`;
    this.buttonGroup.innerHTML = this.buttons.map(button => {
      return `<button class="complex-btn ${button.className || ''}">${button.text}</button>`
    }).join('');
    this.container.addEventListener('click', e => {
      let target = $(e.target);
      if (target.hasClass('complex-btn')) {
        let index = target.index();
        let onClick = this.buttons[index] && this.buttons[index].onClick;
        if (onClick) {
          onClick.call(this, () => {
            this.hide();
          })
        } else {
          this.hide();
        }
      }
    }, false);
  }
}

module.exports = Complex;
