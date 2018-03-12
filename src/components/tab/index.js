const prefix = 'mc-tab';

const tabs = document.querySelectorAll(`.${prefix}-group`);

class Tab {
  constructor(tab) {
    this.btnGroupDom = tab.querySelector(`.${prefix}-items`);
    this.btnDoms = tab.querySelectorAll(`.${prefix}-item`);
    this.panelDoms = tab.querySelectorAll(`.${prefix}-panel`);

    this.btnDoms.forEach((btn, index) => {
      btn.setAttribute('data-index', index)
    })
  }

  active(index) {
    this.btnDoms.forEach((item, btnIndex) => {
      let classList = item.classList;
      if (index == btnIndex) {
        classList.add('active');
      } else {
        classList.remove('active');
      }
    })

    this.panelDoms.forEach((item, panelIndex) => {
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
    this.btnGroupDom.addEventListener('click', this.handleClickBtn.bind(this), false)
  }

  init() {
    this.addListeners();
  }
}

tabs.forEach(tab => {
  new Tab(tab).init()
})
