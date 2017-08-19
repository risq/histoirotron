const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('histoirotron:printer');
const wrap = require('word-wrap');
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

function prepareText(text) {
  return text
    .split('\n')
    .map(line =>
      wrap(line.trim(), {
        width: config.get('printer.maxChars'),
        indent: '',
        trim: true,
      })
    )
    .join('\n')
    .replace(/è/g, '\x8a')
    .replace(/à/g, '\x85')
    .replace(/ù/g, '\x96')
    .replace(/ô/g, '\x93')
    .replace(/ç/g, '\x87')
    .replace(/é/g, '\x82');
}

function print(text, center) {
  debug(`Printing text: "${text}"`);
  debug(prepareText(text))

  return new Promise((resolve, reject) =>
    printer
      .font('a')
      .align(center ? 'ct' : 'lt')
      .size(1, 1)
      .text(prepareText(text), 'ucs2')
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
      .text(prepareText(text), 'ucs2')
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
