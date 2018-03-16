const prefix = 'mc-tab';

const tabs = $(`.${prefix}-group`);


class Tab {
  constructor(tab) {
    this.tabDom = $(tab);
    this.btnGroupDom = this.tabDom.find(`.${prefix}-items`);
    this.btnDoms = this.tabDom.find(`.${prefix}-item`);
    this.panelDoms = this.tabDom.find(`.${prefix}-panel`);
  }

  active(index) {
    this.btnDoms.eq(index).addClass('active').siblings().removeClass('active');
    this.panelDoms.eq(index).addClass('active').siblings().removeClass('active');
  }

  handleClickBtn(e) {
    let index = $(e.target).index();
    if (index >= 0) {
      this.active(index);
    }
  }

  addListeners() {
    this.btnGroupDom.on('click', this.handleClickBtn.bind(this))
  }

  init() {
    this.addListeners();
  }
}

$.each(tabs, (index, tab) => {
  new Tab(tab).init()
})
