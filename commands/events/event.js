const fs = require('fs');
const path = require('path');
const res = require('../../res/res');
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
  stats(events, first, last, l10n) {
    occurances = {};
    for (let i=first; i<=last; i++) {
      if (events[i].heroes.length > 2) {
        events[i].heroes.forEach(
            (h) => {
              if (occurances[h]) {
                occurances[h] = occurances[h] + 1;
              } else {
                occurances[h] = 1;
              }
            },
        );
      } else {
        const h = events[i].heroes[0];
        if (occurances[h]) {
          occurances[h] = occurances[h] + 1;
        } else {
          occurances[h] = 1;
        }
      }
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
      txt += '≥6×: ' +
        counts[5].map((h)=>l10n.HERO_DISPLAY_NAMES[h]).join(' ') + '\n';
    }
    for (let i=4; i>=0; i--) {
      if (counts[i].length) {
        txt += (i+1) + '×: ' +
        counts[i].map((h)=>l10n.HERO_DISPLAY_NAMES[h]).join(' ') + '\n';
      }
    }
    return txt;
  },
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const FILE_PATH = path.resolve(__dirname, '../../cache/events.json');
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

    const lastEvent = EVENTS.events[0];
    let eventStart = lastEvent.date;

    let thisEvent = undefined;
    let nextEvent = undefined;

    if (eventStart > now) { // next event has not been announced
      thisEvent = EVENTS.events[1];
      eventStart = thisEvent.date;
      nextEvent = lastEvent;
    } else {
      thisEvent = lastEvent;
    }

    let response;

    if (thisEvent.heroes.length == 2 ) {
      response = literal(
          cmdRes.responseCurrentWheel,
          '{HERO}', l10n.HERO_DISPLAY_NAMES[thisEvent.heroes[0]],
          '{HERO2}', l10n.HERO_DISPLAY_NAMES[thisEvent.heroes[1]],
      );
    } else {
      response = literal(cmdRes.responseCurrentCM, '{HERO}',
          thisEvent.heroes.map((h)=>l10n.HERO_DISPLAY_NAMES[h]).join(' '),
      );
    }

    const eventEnd = eventStart + (7 * 24 * 60 - 1) * 60 * 1000;
    const timeLeft = eventEnd - now;
    const D = (24 * 60 * 60 * 1000);
    const H = (60 * 60 * 1000);
    const M = (60 * 1000);
    const d = Math.floor(timeLeft / D );
    const h = Math.floor( (timeLeft - d * D)/ H );
    const m = Math.floor( (timeLeft - d * D - h * H)/ M );

    response += literal(
        cmdRes.responseCurrentEnd, '{DAY}', d, '{HOUR}', h, '{MINUTE}', m);

    if (nextEvent) {
      if (nextEvent.heroes.length == 2 ) {
        response += literal(
            cmdRes.responseNextWheel,
            '{HERO}', l10n.HERO_DISPLAY_NAMES[nextEvent.heroes[0]],
            '{HERO2}', l10n.HERO_DISPLAY_NAMES[nextEvent.heroes[1]],
        );
      } else {
        response += literal(cmdRes.responseNextCM, '{HERO}',
            nextEvent.heroes.map((h)=>l10n.HERO_DISPLAY_NAMES[h]).join(' '),
        );
      }
    } else {
      const nag = new Date(eventStart);
      nag.setUTCDate(nag.getUTCDate() + 2);
      if (now > Number(nag)) {
        response += cmdRes.responseNextEvent;
      }
    }

    response +=
      cmdRes.responseRecent13 + this.stats(EVENTS.events, 1, 13, l10n);

    msg.channel.send(response);
  },
};
