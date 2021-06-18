const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
const {safeReact} = require('../../helpers/safeReact');

module.exports = {
  name: 'event',
  async execute(cmdRes, settings, msg, args) {
    const FILE_PATH = path.resolve(__dirname, '../../events.json');
    const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));
    if ((msg.author.id == 706106177439924348) && (args.length > 0)) {
      heroes = args.map( (h) => res.findHero(settings.lang, h) );
      EVENTS.events.sort( (a, b) => a.date - b.date );
      newDate = new Date(EVENTS.events[0].date);
      newDate.setDate(newDate.getDate() + 7);
      newEvent = {date: Number(newDate), heroes: heroes};
      EVENTS.events.unshift(newEvent);
      fs.writeFileSync(FILE_PATH, JSON.stringify(EVENTS));
      safeReact(msg, '✅', null, null);
    } else {
      occurances = {};
      for (let i=0; i<14; i++) {
        EVENTS.events[i].heroes.forEach(
            (h) => {
              if (occurances[h]) {
                occurances[h] = occurances[h] + 1;
              } else {
                occurances[h] = 1;
              }
            },
        );
      }
      keys = Object.keys(occurances)
          .sort((key1, key2) => {
            if (occurances[key1] < occurances[key2]) return 1;
            else if (occurances[key1] > occurances[key2]) return -1;
            else return 0;
          });
      let txt = '**# of appearances in the 14 most recent events:**';
      keys.forEach( (h) => {
        properName = h.charAt(0).toUpperCase() + h.slice(1);
        txt += '\n' + properName + ': ' + occurances[h];
      });
      msg.channel.send(txt);
    }
  },
};
