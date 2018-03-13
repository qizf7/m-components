const prefix = 'mc-select';

const selects = $(`.${prefix}`);


class Select {
  constructor(select) {
    this.select = $(select);

    this.textContainer = this.select.find(`.${prefix}-text-container`);
    this.textInput = this.textContainer.find(`.${prefix}-text`);
    this.valueInput = this.textContainer.find(`.${prefix}-value`);

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
      this.textInput.val(text);
      this.valueInput.val(text);
    }
    return false;
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
