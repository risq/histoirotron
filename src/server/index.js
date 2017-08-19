const Promise = require('bluebird');
const retry = require('bluebird-retry');
const express = require('express');
const path = require('path');
const config = require('config');
const debug = require('debug')('histoirotron:index');

const arduino = require('./arduino');
const printer = require('./printer');

const PORT = process.env.PORT || config.get('server.port');;

function start() {
  debug('Starting server...');

  initModules()
    .catch(err => debug('Error initializing modules', err))
    .then(() => {
        debug('Modules initialized.');
        const app = express();

        app.use(express.static(path.join('dist')));

        app.listen(PORT, () => {
          debug(`App listening on port ${PORT}`);
          printer.print(`- App listening on port ${PORT} -`, true)
            .then(() => printer.feed(4))
        });
    })

}

function initModules() {
  debug('Initializing modules...');

  return arduino.init()
    .then(printer.init);
}

module.exports = {
  start,
}
