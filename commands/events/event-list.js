const fs = require('fs');
const path = require('path');
const {formatDate, proper} = require('./event');

module.exports = {
  name: 'event-list',
  async execute(cmdRes, settings, msg, args) {
    const FILE_PATH = path.resolve(__dirname, '../../events.json');
    const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));
    // const last = EVENTS.events.length-1;
    const last =
       (msg.author.id == 706106177439924348)?EVENTS.events.length-1:6;

    let response = '';
    for (let i=last; i>=0; i--) {
      eventDate = new Date(EVENTS.events[i].date);
      response += formatDate(eventDate) + ': ' +
        EVENTS.events[i].heroes.map((h)=>proper(h)).join(' ') + '\n';
    }
    msg.channel.send(response);
  },
};
