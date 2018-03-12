const prefix = 'mc-select';

const selects = $(`.${prefix}`);


class Select {
  constructor(select) {
    this.select = $(select);

    this.textContainer = this.select.find(`.${prefix}-text-container`);
    this.input = this.textContainer.find(`.${prefix}-text`);

    this.optionContainer = this.select.find(`.${prefix}-option-container`);
  }

  handleToggle(e) {
    $(this.select).toggleClass('show');
  }

  handleSelect(e) {
    let value = $(e.target).text();
    if (value) {
      $(this.select).removeClass('show');
      this.input.val(value);
    }
  }

  addListeners() {
    this.textContainer.on('click', this.handleToggle.bind(this));
    this.optionContainer.on('click', this.handleSelect.bind(this));
  }


  init() {
    this.addListeners()
    console.log('init select')
  }
}

selects.forEach(select => {
  new Select(select).init()
})
