const SerialPort = require('serialport');
const config = require('config');
const debug = require('debug')('histoirotron:arduino');

function init() {
  debug('Initializing module...');

  SerialPort.list((err, ports) => {
    if (err) {
      debug('Error finding ports', err)
    } else {
      debug(`${ports.length} ports found: ${ports.map(port => port.comName).join(' ')}`)
    }
  });

  const arduinoSerialPort = new SerialPort(config.get('arduino.port'), {
    baudRate: config.get('arduino.baudRate'),
  });

  const parser = new SerialPort.parsers.Readline();
  arduinoSerialPort.pipe(parser);

  parser.on('data', onData);

  arduinoSerialPort.on('error', function(err) {
    debug('Error: ', err.message);
  });
}

function onData(data) {
  const string = data.replace(/(\r\n|\n|\r)/gm, '').trim();

  if (string === '') {
    return;
  }

  debug(`>> ${string}`);

  const uidMatch = /UID:\s(.*)/.exec(string);
  if (uidMatch) {
    debug(`Found UID: ${uidMatch[1]}`);
  }
}

module.exports = {
  init
};
