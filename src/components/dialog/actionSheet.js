const Base =  require('./base');

const prefix = 'mc-dialog-actionsheet';

class ActionSheet extends Base {
  static defaultOptions = {
    contentHTML: 'This is content!',
    duration: 2000,
    useMask: false
  }
  constructor(options){
    super();
    $.extend(this, ActionSheet.defaultOptions, options);

    let self = this;
    this.container.className += ` ${prefix}`;

    const { buttons } = options
    let buttonsHtml = buttons.map((item, index) => {
      return `<span class="button" data-index=${index}>${item.text}</span>`
    }).join('');
    this.container.innerHTML = buttonsHtml;
    this.content = this.container.querySelector('.dialog-content-text');

    $(this.container).on('click', '.button', function() {
      let { index } = $(this).data();
      if (buttons[index] && buttons[index].onClick) {
        buttons[index].onClick(buttons[index])
        self.hide()
      }
    })
  }
  hide = () => {
    super.hide();
    $('.mc-dialog-mask').off('click', this.hide)
  }

  show = () => {
    if(!this.mounted) this.mount();
    super.show();
    $('.mc-dialog-mask').on('click', this.hide)
  }
}

module.exports = ActionSheet;
