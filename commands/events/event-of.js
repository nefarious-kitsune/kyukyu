const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
const {formatDate} = require('./event');

module.exports = {
  name: 'event-of',
  async execute(cmdRes, settings, msg, args) {
    const FILE_PATH = path.resolve(__dirname, '../../events.json');
    const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));

    const hero = res.findHero(settings.lang, args[0]);
    if (!hero) return;

    const results = [];
    for (let i=0; i < EVENTS.events.length; i++) {
      event = EVENTS.events[i];
      if (event.heroes.indexOf(hero) != -1) {
        r = formatDate(new Date(event.date)) +
            ((event.heroes.length > 2)?' (Card Master)':' (Wheel)');
        results.push(r);
        if (results.length >= 5) break;
      };
    }
    if (results.length == 0) return;
    msg.channel.send(results.join('\n'));
  },
};
