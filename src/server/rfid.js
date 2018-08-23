const Promise = require('bluebird');
const path = require('path');
const config = require('config');
const fs = require('fs');

const arduino = require('./arduino');

const PORT = process.env.PORT || config.get('server.port');;
const time = Date.now();
const uids = {

};

function start() {
  arduino.init()
    .then(() => {
      console.log("arduino init");
        arduino.events.on('uid', onUid);
    })
    .catch(err => console.log(err))
}

function onUid(uid) {
  console.log(uid)

  if (uids[uid]) {
    console.log(uids[uid]);
    return;
  }
  const word = `word-${Object.keys(uids).length}`;
  uids[uid] = word;
  console.log(word);
  fs.writeFileSync(`./words-${time}.json`, JSON.stringify(uids))
}

start();
