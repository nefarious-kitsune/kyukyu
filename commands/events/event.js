const fs = require('fs');
const path = require('path');
const {literal} = require('../../helpers/literal');

module.exports = {
  name: 'event',
  formatDate(d) {
    yyyy = d.getUTCFullYear();
    mm = d.getUTCMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    dd = d.getUTCDate();
    if (dd < 10) dd = '0' + dd;
    return (yyyy + '.' + mm + '.' + dd);
  },
  proper(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  stats(events, first, last) {
    occurances = {};
    for (let i=first; i<=last; i++) {
      events[i].heroes.forEach(
          (h) => {
            if (occurances[h]) {
              occurances[h] = occurances[h] + 1;
            } else {
              occurances[h] = 1;
            }
          },
      );
    }
    counts = [
      [], // once
      [], // twice
      [], // 3-times
      [], // 4-times
      [], // 5-times
      [], // 6 or more times
    ];
    Object.keys(occurances).forEach((k)=>{
      if (occurances[k] >= 6) {
        counts[5].push(k);
      } else {
        counts[occurances[k]-1].push(k);
      }
    });
    let txt = '';
    if (counts[5].length) {
      txt += '≥6×: ' + counts[5].map((h)=>this.proper(h)).join(' ') + '\n';
    }
    for (let i=4; i>=0; i--) {
      if (counts[i].length) {
        txt += (i+1) + '×: ' +
        counts[i].map((h)=>this.proper(h)).join(' ') + '\n';
      }
    }
    return txt;
  },
  async execute(cmdRes, settings, msg, args) {
    const FILE_PATH = path.resolve(__dirname, '../../events.json');
    const EVENTS = JSON.parse(fs.readFileSync(FILE_PATH));

    const localTime = new Date();
    const utcTime = Date.UTC(
        localTime.getUTCFullYear(),
        localTime.getUTCMonth(),
        localTime.getUTCDate(),
        localTime.getUTCHours(),
        localTime.getUTCMinutes(),
        0, 0,
    );
    const now = Number(utcTime);

    const event = EVENTS.events[0];
    const eventStart = event.date;

    let response;

    if (eventStart > now) { // next event announced
      if (event.heroes.length == 1 ) {
        response = literal(
            cmdRes.responseNextWheel,
            '{HERO}', this.proper(event.heroes[0]),
        );
      } else {
        response = literal(
            cmdRes.responseNextCM,
            '{HERO}', event.heroes.map((h)=>this.proper(h)).join(' '),
        );
      }
      response +=
        '\n' + cmdRes.responseRecent13 + this.stats(EVENTS.events, 1, 13);
      msg.channel.send(response);
    } else { // next event has not been announced
      if (event.heroes.length == 1 ) {
        response = literal(
            cmdRes.responseCurrentWheel,
            '{HERO}', this.proper(event.heroes[0]),
        );
      } else {
        response = literal(
            cmdRes.responseCurrentCM,
            '{HERO}', event.heroes.map((h)=>this.proper(h)).join(' '),
        );
      }
      response +=
        '\n' + cmdRes.responseRecent14 + this.stats(EVENTS.events, 0, 13);

      const nag = new Date(eventStart);
      nag.setUTCDate(nag.getUTCDate() + 4);
      if (now > Number(nag)) {
        response += '\n' + cmdRes.responseNextEvent;
      }
      msg.channel.send(response);
    }
  },
};
