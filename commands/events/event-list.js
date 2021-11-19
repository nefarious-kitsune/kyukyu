const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
const {formatDate} = require('./event');

module.exports = {
  name: 'event-list',
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const FILE_PATH = path.resolve(__dirname, '../../events.json');
    const events = JSON.parse(fs.readFileSync(FILE_PATH)).events;

    const CM = '<:eventcard:909986289535832104> ';
    const WOF = '<:eventwheel:909986289552617502> ';

    const last = 6;
    // const last =
    //    (msg.author.id == '706106177439924348')?events.length-1:6;

    let response = '';
    for (let i=last; i>=0; i--) {
      if (response.length > 1800) {
        msg.channel.send(response);
        response = '';
      }
      const formattedEventDate = formatDate(new Date(events[i].date));
      const heroes = events[i].heroes.map((h)=>l10n.HERO_DISPLAY_NAMES[h]);
      if (heroes.length > 2) {
        response += CM + formattedEventDate + ': ' +
          heroes.join(' ') + '\n';
      } else {
        response += WOF + formattedEventDate + ': ' +
          `${heroes[0]} (${heroes[1]})\n`;
      }
    }
    msg.channel.send(response);
  },
};
