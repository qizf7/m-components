const Base = require('./base');

const prefix = ' mc-dialog-custom';

class CustomDialog extends Base {
  constructor(options){
    super();
    this.container.className += ` ${prefix}`;
  }
}

module.exports = CustomDialog;
