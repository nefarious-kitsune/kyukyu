const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
const {formatDate, proper} = require('./event');
const GLOBAL = require('../../global');

module.exports = {
  name: 'event-add',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == GLOBAL.USER_KITSUNE_ID) && (args.length > 0)) {
      const FILE_PATH = path.resolve(__dirname, '../../cache/events.json');
      const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));
      heroes = args.map( (h) => res.findHero(settings.lang, h) );
      // EVENTS.events.sort( (a, b) => a.date - b.date );
      let eventDate;
      if (EVENTS.events.length == 0) {
        eventDate = new Date(Date.UTC(2020, 4, 19));
      } else {
        eventDate = new Date(EVENTS.events[0].date);
        eventDate.setUTCDate(eventDate.getUTCDate() + 7);
      }

      newEvent = {date: Number(eventDate), heroes: heroes};
      EVENTS.events.unshift(newEvent);
      fs.writeFileSync(FILE_PATH, JSON.stringify(EVENTS));
      msg.channel.send(
          `Added event for ${heroes.map((h)=>proper(h)).join(' ')} ` +
          `starting at ${formatDate(eventDate)}`,
      );
    }
  },
};
