const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;

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
