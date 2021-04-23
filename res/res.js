const fs = require('fs');
const path = require('path');

const locale = require(path.resolve(__dirname, process.env.lang, 'locale'));

const images = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'images.json'))
);

module.exports = {
  locale: locale,
  iamges: images,
};
