const prefix = 'mc-tab';

const tabs = document.querySelectorAll(`.${prefix}-group`);

class Tab {
  constructor(tab) {
    this.btnGroup = tab.querySelector(`.${prefix}-items`);
    this.btns = tab.querySelectorAll(`.${prefix}-item`);
    this.panels = tab.querySelectorAll(`.${prefix}-panel`);

    this.btns.forEach((btn, index) => {
      btn.setAttribute('data-index', index)
    })
  }

  active(index) {
    this.btns.forEach((item, btnIndex) => {
      let classList = item.classList;
      if (index == btnIndex) {
        classList.add('active');
      } else {
        classList.remove('active');
      }
    })

    this.panels.forEach((item, panelIndex) => {
      let classList = item.classList;
      if (index == panelIndex) {
        classList.add('active');
      } else {
        classList.remove('active');
      }
    })
  }

  handleClickBtn(e) {
    let index = e.target.getAttribute('data-index');
    if (index) {
      this.active(index);
    }
  }

  addListeners() {
    this.btnGroup.addEventListener('click', this.handleClickBtn.bind(this), false)
  }

  init() {
    this.addListeners();
  }
}

tabs.forEach(tab => {
  new Tab(tab).init()
})
