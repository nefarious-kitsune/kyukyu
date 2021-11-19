const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {formatDate} = require('./event');

module.exports = {
  name: 'event-of',
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const FILE_PATH = path.resolve(__dirname, '../../events.json');
    const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));

    const CM = '<:eventcard:909986289535832104> ';
    const WOF = '<:eventwheel:909986289552617502> ';

    const hero = res.findHero(settings.lang, args[0]);
    if (!hero) return;

    const heroDisplayName = l10n.HERO_DISPLAY_NAMES[hero];

    if (hero == 'athena') {
      msg.channel.send(literal(l10n.NO_INFO, '{TEXT}', heroDisplayName));
      return;
    }

    const results = [];
    for (let i=0; i < EVENTS.events.length; i++) {
      event = EVENTS.events[i];
      if (event.heroes.indexOf(hero) != -1) {
        results.push(
            ((event.heroes.length > 2)?CM:WOF) +
            formatDate(new Date(event.date)),
        );
        if (results.length >= 5) break;
      };
    }
    if (results.length == 0) {
      msg.channel.send(literal(l10n.NO_INFO, '{TEXT}', heroDisplayName));
    } else {
      msg.channel.send(results.join('\n'));
    }
  },
};
