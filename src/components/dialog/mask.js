const uniqueId = require('./utils').uniqueId;

class Mask {
  constructor(options) {
    options = Object.assign({
      zIndex: 9,
      opacity: .8
    }, options);
    this.id = uniqueId();
    this.mounted = false;
    this.container = document.createElement('div');
    this.container.className = 'mask';
    this.container.setAttribute('mask-id', this.id);
    this.container.addEventListener('touchmove', e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  }
  mount() {
    document.body.appendChild(this.container);
    this.mounted = true;
  }
  show() {
    if(!this.mounted) this.mount();
    this.container.style.display = 'block';
    setTimeout(() => this.container.classList.add('in'), 0);
    this.isDisplay = true;
  }
  hide() {
    this.container.classList.remove('in')
    setTimeout(() => this.container.style.display = 'none', 300);
    this.isDisplay = false;
  }
  on(eventType, fun) {
    this.container.addEventListener(eventType, fun, false);
  }
}

module.exports = Mask;