const prefix = 'mc-select';

const selects = $(`.${prefix}`);

class Select {
  constructor(dom, options) {
    this.select = $(dom);

    this.textContainerDom = this.select.find(`.${prefix}-text-container`);
    this.textDom = this.textContainerDom.find(`.${prefix}-text`);
    this.valueInputDom = this.textContainerDom.find(`.${prefix}-value`);

    this.optionContainer = this.select.find(`.${prefix}-option-container`);
    this.optionContainerHeight = this.optionContainer[0].scrollHeight;

    if (!options.value) {
      this.textDom.addClass('placeholder');
      this.textDom.text(this.textDom.attr('placeholder'));
    }
    document.addEventListener('click', (e) =>{
      this.select.removeClass('show');
    }, false)

    this.addListeners()
  }

  handleToggle(e) {
    if (this.select.hasClass('show')) {
      this.select.removeClass('show');
      this.optionContainer.height(0);
    } else {
      this.select.addClass('show');
      this.optionContainer.height(this.optionContainerHeight);
    }
    return false;
  }

  handleSelect(e) {
    let value = $(e.target).attr('data-value');
    let text = $(e.target).text();
    if (value) {
      this.handleToggle()
      $(this.textDom).removeClass('placeholder')
      this.textDom.text(text);
      this.valueInputDom.val(value);
      this.select.trigger('change');
      this.valueInputDom.trigger('change');
    }
    return false;
  }

  addListeners() {
    this.textContainerDom.on('click', this.handleToggle.bind(this));
    this.optionContainer.on('click', this.handleSelect.bind(this));
  }
}

module.exports = Select;
