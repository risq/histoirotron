const Promise = require('bluebird');
const retry = require('bluebird-retry');
const config = require('config');
const debug = require('debug')('histoirotron:printer');
const wrap = require('word-wrap');
const rp = require('request-promise');

let ready;

function print(text, center = false, feed = 0, size = 1) {
  return retry(() => rp({
      method: 'POST',
      uri: config.get('printer.printUrl'),
      body: {
          text: prepareText(text),
          center,
          feed,
          size,
      },
      json: true,
  }), {
    interval: 1000,
  })
  .catch((err) => debug(err));
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
    .replace(/é/g, '\x82')
    .replace(/ê/g, 'e');
}

module.exports = {
  print,
};

// function init() {
//   debug('Initializing module...');
//
//   return new Promise((resolve, reject) => {
//     device.open((err) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       debug(`Printer ready on port ${config.get('printer.port')}`);
//       ready = true;
//       resolve();
//     });
//   })
//   .then(() => printLarge('Printer ready', true))
// }
//
//
// function print(text, center) {
//   debug(`Printing text: "${text}"`);
//
//   if (!ready) {
//     return Promise.reject(new Error('Printer is not ready'));
//   }
//
//   return new Promise((resolve, reject) =>
//     printer
//       .font('a')
//       .align(center ? 'ct' : 'lt')
//       .size(1, 1)
//       .text(prepareText(text), 'ucs2')
//       .flush(resolve)
//     );
// }
//
// function printLarge(text, center) {
//   debug(`Printing text (large): "${text}"`);
//
//   if (!ready) {
//     return Promise.reject(new Error('Printer is not ready'));
//   }
//
//   return new Promise((resolve, reject) =>
//     printer
//       .font('a')
//       .align(center ? 'ct' : 'lt')
//       .size(2, 2)
//       .text(prepareText(text), 'ucs2')
//       .flush(resolve)
//     );
// }
//
// function feed(feed = 1) {
//   return new Promise((resolve, reject) =>
//     printer
//       .feed(feed)
//       .flush(resolve)
//     );
// }
//
