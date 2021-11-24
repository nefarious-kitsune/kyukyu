const GLOBAL = require('../../global');

const L10N_EN = require('./en.common');

const {
  STRINGS, SCENARIO_TYPE, RESOLUTION_TYPE, diceRoll, pause, wait,
} = require('./src/en.common');

const {literal} = require('../../helpers/literal');
const {normalize} = require('../../helpers/normalize');

const enroll = require('./src/en.enroll');
// const enroll = require('./src/en.enroll.rlgl');

// const Player = require('./src/ringPlayer');
const Master = require('./src/ringPlayer');

const SCENARIOS =
  require('./src/en.chance')
      .concat(require('./src/en.danger'));

const GAME_CHANNELS = [GLOBAL.RING_CHANNEL, GLOBAL.RING_TEST_CHANNEL];

const GAME_SETTINGS = {
  RESPONSE_TIME: 25,
  PAUSE_AFTER_DAY_ENDS: 10,
  PAUSE_BEFORE_GAME_START: 15, // 5
  ENTRY_TIME_LIMIT: 60, // 15
  PLAYER_LIMIT: 50,
  WINNER_LIMIT: 2,
  SPECIAL_TRIGGER: 5,
};

// const BLUE = 0x3170a6; // (49, 112, 166)
// const RED = 0xb83a34; // (184, 58, 52)
// const GREEN = 0x77993c; // (119, 153, 60)

const RING_MASTER_REVIVE_RATE = 0.08;

const MAX_MEDAL = 5; // maximum number of medals a player can have.

/*
TRAP

You saw a small trial leading to the woods. This could be a short cut.
- Take the small trial
- Stay on the main road

The road is getting roacky

There was a heavy shower, and the road became very muddy.

*/

module.exports = {
  name: 'ring',
  async execute(cmdRes, settings, msg, args) {
    if (GAME_CHANNELS.includes(msg.channelId)) {
      const master = new Master(msg.channel, GAME_SETTINGS, L10N_EN);
      if (msg.channelId == GLOBAL.RING_CHANNEL) {
        const CB = msg.client.AOW_CB;
        CB.send(literal(
            STRINGS.PREANNOUNCEMENT,
            '{SECONDS}', GAME_SETTINGS.PAUSE_BEFORE_GAME_START),
        );
        enroll.announce(GAME_SETTINGS, master);
        pause(GAME_SETTINGS.PAUSE_BEFORE_GAME_START).then(()=> {
          CB.send(STRINGS.LETSGO);
          enroll.start(GAME_SETTINGS, master);
          pause(GAME_SETTINGS.ENTRY_TIME_LIMIT).then(()=> {
            enroll.stop(GAME_SETTINGS, master);
            pause(GAME_SETTINGS.PAUSE_AFTER_DAY_ENDS)
                .then(() => master.startDay());
          });
        });
      } else {
        enroll.announce(GAME_SETTINGS, master);
        pause(GAME_SETTINGS.PAUSE_BEFORE_GAME_START).then(()=> {
          enroll.start(GAME_SETTINGS, master);
          pause(GAME_SETTINGS.ENTRY_TIME_LIMIT).then(()=> {
            enroll.stop(GAME_SETTINGS, master);
            pause(GAME_SETTINGS.PAUSE_AFTER_DAY_ENDS)
                .then(() => master.startDay());
          });
        });
      }
    }
  },
};

