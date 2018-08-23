const SerialPort = require('serialport');
const config = require('config');
const EventEmitter = require('events');

const debug = require('debug')('histoirotron:arduino');

const events = new EventEmitter();

let port;

function init() {
  debug('Initializing module...');

  return new Promise((resolve, reject) => {
    port = new SerialPort(config.get('arduino.port'), {
        baudRate: config.get('arduino.baudRate'),
        parser: SerialPort.parsers.readline('\n'),
      }, (err) => {
        if (err) {
          reject(err);
          return;
        }
        debug(`Arduino ready on port ${config.get('arduino.port')}`);
        resolve();
      });

    port.on('data', onData);

    port.on('error', function(err) {
      debug('Error: ', err.message);
    });
  });
}

function onData(data) {
  const string = data.replace(/(\r\n|\n|\r)/gm, '').trim();

  if (string === '') {
    return;
  }

  if (string === 'Button') {
    debug('button');
    console.log("")
    events.emit('button');
    return;
  }

  if (string === '[STOP_SCAN]') {
    debug('Scan finished');
    events.emit('scan-stop');
    return;
  }

  const uidMatch = /\[READER\](.*)\[UID\](.*)/.exec(string);
  if (uidMatch) {
    const reader = uidMatch[1];
    const uid = uidMatch[2];
    debug(`Found UID: ${uid} READER: ${reader}`);
    events.emit('uid', reader,  uid);
    return;
  }

  debug(`serial >> ${string}`);
}

module.exports = {
  init,
  events,
};
