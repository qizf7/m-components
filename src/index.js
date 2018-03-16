require('./components/tab')
require('./components/select')
require('./components/calendar')

const Alert = require('./components/dialog/alert');
const Confirm = require('./components/dialog/confirm');
const Toast = require('./components/dialog/toast');

module.exports = {
  Alert: Alert,
  Confirm,
  Toast
}
