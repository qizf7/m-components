const prefix = 'mc-select';

const selects = $(`.${prefix}`);

class Select {
  constructor(select) {
    this.select = $(select);

    this.textContainerDom = this.select.find(`.${prefix}-text-container`);
    this.textInputDom = this.textContainerDom.find(`.${prefix}-text`);
    this.valueInputDom = this.textContainerDom.find(`.${prefix}-value`);

    this.optionContainer = this.select.find(`.${prefix}-option-container`);

    document.addEventListener('click', (e) =>{
      $(this.select).removeClass('show');
    }, false)
  }

  handleToggle(e) {
    $(this.select).toggleClass('show');
    return false;
  }

  handleSelect(e) {
    let value = $(e.target).attr('data-value');
    let text = $(e.target).text();
    if (value) {
      $(this.select).removeClass('show');
      this.textInputDom.val(text);
      this.valueInputDom.val(text);
    }
    return false;
  }

  addListeners() {
    this.textContainerDom.on('click', this.handleToggle.bind(this));
    this.optionContainer.on('click', this.handleSelect.bind(this));
  }

  init() {
    this.addListeners()
  }
}

$.each(selects, (index, select) => {
  new Select(select).init()
})
