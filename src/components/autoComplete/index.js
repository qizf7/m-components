const prefix = 'mc-auto-complete';

class Select {
  constructor(dom, options) {
    this.select = $(dom);

    this.textContainerDom = this.select.find(`.${prefix}-text-container`);
    this.textInputDom = this.textContainerDom.find(`.${prefix}-text`);
    this.valueInputDom = this.textContainerDom.find(`.${prefix}-value`);

    this.optionContainerDom = this.select.find(`.${prefix}-option-container`);
    this.optionDoms = this.select.find(`.${prefix}-option`);

    document.addEventListener('click', (e) =>{
      this.select.removeClass('show');
    }, false)

    this.addListeners()
  }

  handleToggle(e) {
    this.select.toggleClass('show');
    return false;
  }

  handleInput(e) {
    let optionDoms = $.grep(this.optionDoms, item => {
      return $(item).text().match($(e.target).val());
    });
    this.optionContainerDom.html(optionDoms);
  }

  handleSelect(e) {
    let value = $(e.target).attr('data-value');
    let text = $(e.target).text();
    if (value) {
      $(this.select).removeClass('show');
      this.textInputDom.val(text);
      this.valueInputDom.val(value);
      this.valueInputDom.trigger('change');
      this.select.trigger('change');
    }
    return false;
  }

  addListeners() {
    this.textInputDom.on('input', this.handleInput.bind(this));
    this.textContainerDom.on('click', this.handleToggle.bind(this));
    this.optionContainerDom.on('click', this.handleSelect.bind(this));
  }
}

module.exports = Select;
