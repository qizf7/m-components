const prefix = 'mc-tab';

const tabs = $(`.${prefix}-group`);


class Tab {
  constructor(dom, options ={}) {
    this.tabDom = $(dom);
    this.btnGroupDom = this.tabDom.find(`.${prefix}-btns`);
    this.btnDoms = this.tabDom.find(`.${prefix}-btn`);
    this.panelDoms = this.tabDom.find(`.${prefix}-panel`);

    this.addListeners();
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
}

module.exports = Tab;
