const express = require('express');
const app = express();
const fs = require('fs');
const multer  = require('multer')
const config = require('./config');

const upload = multer({ storage: multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
}) })

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir)
}

for (let paths = config.paths, i = paths.length - 1; i >= 0; i--) {
  console.log(`(${paths[i]}) have been served!`)
  app.use(express.static(`${paths[i]}`))
}

app.post('/upload', upload.single('file'), function (req, res) {
  res.json({
    status: 0,
    msg: 'success',
    url: 'urlurlurlurlurl'
  })
})


app.listen(config.port, () => {
  console.log(`Server start at port ${config.port}...`);
});
