const Mask = require('./mask');
const uniqueId = require('./utils').uniqueId;

const prefix = 'mc-dialog';

class Base {
  static mask = new Mask()
  constructor() {
    this.id = uniqueId();
    this.isDisplay = false;
    this.useMask = true; // 是否使用遮罩
    this.mounted = false;
    this.container = document.createElement('div');
    this.container.className = prefix;
    this.container.setAttribute('dialog-id', this.id)
    this.classList = this.container.classList;
    this.container.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
    }, false)
  }
  mount() {
    document.body.appendChild(this.container);
    this.mounted = true;
  }
  show() {
    if(this.useMask) Base.mask.show();
    this.container.style.display = 'block';
    setTimeout(() => this.classList.add('in'), 0);
    this.isDisplay = true;
  }
  hide() {
    if(this.useMask) Base.mask.hide();
    this.classList.remove('in')
    setTimeout(() => this.container.style.display = 'none', 300)
    this.isDisplay = false;
  }
}

module.exports = Base;
