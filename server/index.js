const express = require('express');
const app = express();
const config = require('./config');

for (let paths = config.paths, i = paths.length - 1; i >= 0; i--) {
  console.log(`(${paths[i]}) have been served!`)
  app.use(express.static(`${paths[i]}`))
}

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server start at port ${config.port}...`);
});
