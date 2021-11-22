const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
const {formatDate, proper} = require('./event');
const GLOBAL = require('../../global');

module.exports = {
  name: 'event-delete',
  async execute(cmdRes, settings, msg, args) {
    if (msg.author.id == GLOBAL.USER_KITSUNE_ID) {
      const FILE_PATH = path.resolve(__dirname, '../../cache/events.json');
      const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));
      lastEvent = EVENTS.events.shift();
      eventDate = new Date(lastEvent.date);
      heroes = lastEvent.heroes.map( (h) => res.findHero(settings.lang, h) );
      fs.writeFileSync(FILE_PATH, JSON.stringify(EVENTS));
      msg.channel.send(
          `Deleted event for ${heroes.map((h)=>proper(h)).join(' ')} ` +
          `starting at ${formatDate(eventDate)}`,
      );
    }
  },
};
