const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('histoirotron:printer');

const escpos = require('escpos');
const device  = new escpos.Serial(config.get('printer.port'));
const printer = new escpos.Printer(device);

function init() {
  debug('Initializing module...');

  return new Promise((resolve, reject) => {
    device.open((err) => {
      if (err) {
        reject(err);
        return;
      }
      debug(`Printer ready on port ${config.get('printer.port')}`);
      resolve();
    });
  })
    .then(() => printLarge('Printer ready', true))
}

function print(text, center) {
  debug(`Printing text: "${text}"`);

  return new Promise((resolve, reject) =>
    printer
      .font('a')
      .align(center ? 'ct' : 'lt')
      .size(1, 1)
      .text(text)
      .flush(resolve)
    );
}

function printLarge(text, center) {
  debug(`Printing text (large): "${text}"`);

  return new Promise((resolve, reject) =>
    printer
      .font('a')
      .align(center ? 'ct' : 'lt')
      .size(2, 2)
      .text(text)
      .flush(resolve)
    );
}

function feed(feed = 1) {
  return new Promise((resolve, reject) =>
    printer
      .feed(feed)
      .flush(resolve)
    );
}

module.exports = {
  init,
  print,
  printLarge,
  feed,
};
