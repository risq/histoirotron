const Promise = require('bluebird');
const retry = require('bluebird-retry');
const http = require('http');
const express = require('express');
const path = require('path');
const config = require('config');
const debug = require('debug')('histoirotron:index');
const socketIo = require('socket.io');
const appRoot = require('app-root-path');

const arduino = require('./arduino');
const printer = require('./printer');
const wordsList = require('./words');
const storyGenerator = require('./storyGenerator');

const PORT = process.env.PORT || config.get('server.port');;

let app;
let server;
let io;
let words;
let scanStarted;

function start() {
  debug('Starting server...');

  initModules()
    .catch(err => debug('Error initializing modules', err))
    .then(() => {
        debug('Modules initialized.', path.join(appRoot.path, 'dist'));
        app = express();
        app.use(express.static(path.join(appRoot.path, 'dist')));

        server = http.Server(app);
        io = socketIo(server);
        io.on('connection', onConnection);

        server.listen(PORT, () => {
          debug(`App listening on port ${PORT}`);
          printer.print(`- App listening on port ${PORT} -`, true, 3)
        });

        arduino.events.on('scan-start', onScanStart);
        arduino.events.on('scan-stop', onScanStop);
        arduino.events.on('uid', onUid);
    })
    .catch(err => debug('Error initializing app', err))
}

function initModules() {
  debug('Initializing modules...');

  return arduino.init()
    //.then(printer.init);
}

function onConnection(socket) {
  debug('Client socket connected');
  io.sockets.emit('news', { hello: 'world' });
}

function onScanStart() {
  debug('Starting collecting UIDs...');
  words = [];
  scanStarted = true;
  io.sockets.emit('startScanAnimation');
}

function onScanStop() {
  debug(`Scan ended, collected words: ${words.join(', ')}`);
  scanStarted = false;

  io.sockets.emit('startEndAnimation');
  printer.print(words.join(', '), true, 2, 2)
    .then(() => printer.print(storyGenerator.generateStory(), false, 4))
}

function onUid(uid) {
  debug('word:', wordsList[uid]);
  if (!scanStarted || !wordsList[uid]) {
    return;
  }

  words.push(wordsList[uid]);
}

module.exports = {
  start,
}
