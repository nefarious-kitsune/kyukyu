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
  getCommandRes(lang, cmdName) {
    const commands = this.l10n[lang].commands;
    for (let i = 0; i < commands.length; i++ ) {
      if (commands[i].aliases.includes(cmdName)) return commands[i];
    }
    return false;
  },
  findTroops(lang, troopsName) {
    name = troopsName.toLowerCase().trim();
    const map = this.l10n[lang].TROOPS_ALIASES;
    for (let i = 0; i < map.length; i++) {
      if (map[i].includes(name)) return map[i][0];
    }
    return false;
  },
  findHero(lang, heroName) {
    name = heroName.toLowerCase().trim();
    const map = this.l10n[lang].HERO_ALIASES;
    for (let i = 0; i < map.length; i++) {
      if (map[i].includes(name)) return map[i][0];
    }
    return false;
  },
};
