const express = require('express');
const path = require('path');
const config = require('config');
const debug = require('debug')('histoirotron:index');

const arduino = require('./arduino');

const PORT = process.env.PORT || config.get('server.port');;

function start() {
  debug('Starting server...')
  arduino.init();

  const app = express();

  app.use(express.static(path.join('dist')));

  app.listen(PORT, () => {
    debug(`App listening on port ${PORT}`);
  });
}

module.exports = {
  start,
}
