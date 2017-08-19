const SerialPort = require('serialport');
const config = require('config');

const debug = require('debug')('histoirotron:arduino');

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

  debug(`serial >> ${string}`);

  const uidMatch = /UID:\s(.*)/.exec(string);
  if (uidMatch) {
    debug(`Found UID: ${uidMatch[1]}`);
  }
}

module.exports = {
  init
};
