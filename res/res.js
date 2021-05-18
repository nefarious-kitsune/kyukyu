const fs = require('fs');
const path = require('path');

const locale = require(path.resolve(__dirname, process.env.lang, 'locale'));

const l10n = {
  'en': require('./en/locale'),
  'zht': require('./zht/locale'),
};

const images = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'images.json')),
);

module.exports = {
  locale: locale,
  images: images,
  l10n: l10n,
  findTroops(troopsName) {
    name = troopsName.toLowerCase().trim();
    map = this.locale.TROOPS_ALIASES;
    for (let i = 0; i < map.length; i++) {
      if (map[i].includes(name)) return map[i][0];
    }
    return false;
  },
  findHero(heroName) {
    name = heroName.toLowerCase().trim();
    map = this.locale.HERO_ALIASES;
    for (let i = 0; i < map.length; i++) {
      if (map[i].includes(name)) return map[i][0];
    }
    return false;
  },
};
