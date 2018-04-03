const prefix = 'mc-auto-complete';

class AutoComplete {
  constructor(dom, options) {
    this.autoComplete = $(dom);

    this.textContainerDom = this.autoComplete.find(`.${prefix}-text-container`);
    this.textInputDom = this.textContainerDom.find(`.${prefix}-text`);
    this.valueInputDom = this.textContainerDom.find(`.${prefix}-value`);

    this.optionContainerDom = this.autoComplete.find(`.${prefix}-option-container`);
    this.optionDoms = this.autoComplete.find(`.${prefix}-option`);

    document.addEventListener('click', (e) =>{
      this.autoComplete.removeClass('show');
    }, false)

    this.addListeners();

    this.keyword = '';
  }

  handleToggle(e) {
    this.autoComplete.toggleClass('show');
    return false;
  }

  handleInput(e) {
    let value = $(e.target).val();
    this.valueInputDom.val(value);
    if (value) {
      this.autoComplete.trigger('change');
    }
    this.keyword = value;
    this.renderOptions();
  }

  handleSelect(e) {
    let value = $(e.target).attr('data-value');
    let text = $(e.target).text();
    if (value) {
      this.autoComplete.removeClass('show');
      this.textInputDom.val(text);
      this.valueInputDom.val(value);
      this.valueInputDom.trigger('change');
      this.autoComplete.trigger('change');
    }
    this.keyword = value;
    this.renderOptions();
  }

  renderOptions() {
    let optionDoms = $.grep(this.optionDoms, item => {
      return $(item).text().match(this.keyword);
    });
    this.optionContainerDom.html(optionDoms);
    return false;
  }

  addListeners() {
    this.textInputDom.on('input', this.handleInput.bind(this));
    this.textContainerDom.on('click', this.handleToggle.bind(this));
    this.optionContainerDom.on('click', this.handleSelect.bind(this));
  }
}

module.exports = AutoComplete;
