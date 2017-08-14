const path = require('path');
const sc = require('../src/client/shared/config');
const slash = require('slash');
const walk = require('walk');

module.exports = (dir) => {
  return new Promise((resolve, _reject) => {
    const walker = walk.walk(dir);
    const map = Object.create(null);
    walker.on('file', function(root, stats, next) {
      if (stats.type === 'file' && stats.name.endsWith('.png')) {
        const filePath = path.join(root, stats.name);
        const relative = slash(path.relative(dir, filePath));
        const key = relative.replace(/\.png$/, '');
        const value = path.posix.join(sc.texturePath, relative);
        map[key] = value;
      }
      return next();
    });
    walker.on('end', () => {
      resolve(JSON.stringify(map));
    });
  });
};
