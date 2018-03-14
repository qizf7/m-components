const Base = require('./base');

class CustomDialog extends Base {
  constructor(options){
    super();
    this.container.className += ' custom-dialog';
  }
}

module.exports = CustomDialog;
