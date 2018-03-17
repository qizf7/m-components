require('./components/tab');
require('./components/select');
require('./components/calendar');
require('./components/pictureWall');

const Alert = require('./components/dialog/alert');
const Confirm = require('./components/dialog/confirm');
const Complex = require('./components/dialog/complex');
const Toast = require('./components/dialog/toast');
const Loading = require('./components/dialog/loading');

module.exports = {
  Alert,
  Confirm,
  Complex,
  Toast,
  Loading
}
