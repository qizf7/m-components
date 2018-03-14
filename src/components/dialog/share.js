const Mask = require('./mask');

class Share extends Mask {
  constructor() {
    super();
    this.container.classList.add('share-mask')
    this.container.addEventListener('click', () => {
      this.hide();
    }, false)
  }
}
module.exports = Share
