const express = require('express');
const path = require('path');
const config = require('config');

const PORT = process.env.PORT || config.get('port');;

function start() {
  const app = express();

  app.use(express.static(path.join('dist')));

  app.listen(PORT, () => {
    console.info(`App listening on port ${PORT}`);
  });
}

module.exports = {
  start,
}
