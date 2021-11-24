const GLOBAL = require('../../global');
const {literal} = require('../../helpers/literal');

const L10N_EN = require('./en/_l10n');
const {pause} = require('./src/common');
const ENROLL = require('./en/enroll');
// const enroll = require('./src/en.enroll.rlgl');

// const Player = require('./src/ringPlayer');
const Master = require('./src/ringMaster');

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
      const master = new Master(
          msg.author, msg.channel, GAME_SETTINGS, L10N_EN);
      const enroll = new ENROLL(GAME_SETTINGS, master);
      const CB =
        (msg.channelId == GLOBAL.RING_CHANNEL)?
        msg.client.AOW_CB:
        msg.channel;

      CB.send(literal(
          L10N_EN.PREANNOUNCEMENT,
          '{SECONDS}', GAME_SETTINGS.PAUSE_BEFORE_GAME_START),
      );

      enroll.announce();

      pause(GAME_SETTINGS.PAUSE_BEFORE_GAME_START).then(() => {
        CB.send(L10N_EN.LETSGO);
        enroll.start();
        pause(GAME_SETTINGS.ENTRY_TIME_LIMIT).then(()=> {
          enroll.stop();
          enroll = null;
          pause(GAME_SETTINGS.PAUSE_AFTER_DAY_ENDS)
              .then(() => master.startDay());
        });
      });
    }
  },
};

