const fs = require('fs');
const path = require('path');
const {literal} = require('../../helpers/literal');
const {pause} = require('./src/common');
const L10N_EN = require('./en/_l10n');
const ENROLL = require('./en/enroll');
const Master = require('./src/ringMaster');

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
  async start(msg) {
    const allSettings = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, './ring.json')),
    );
    if (!allSettings.hasOwnProperty(msg.guildId)) return;

    const guildSettings = allSettings[msg.guildId];
    if (guildSettings.gameChannel != msg.channelId) return;

    const generalChat =
        await msg.guild.channels.fetch(guildSettings.generalChannel);

    const master = new Master(
        msg.author, msg.channel, guildSettings, L10N_EN);

    const enroll = new ENROLL(guildSettings, master);

    generalChat.send(literal(
        L10N_EN.PREANNOUNCEMENT,
        '{SECONDS}', guildSettings.pauseBeforeGame),
    );

    enroll.announce();

    pause(guildSettings.pauseBeforeGame).then(() => {
      generalChat.send(L10N_EN.LETSGO);
      enroll.start();
      pause(guildSettings.entryTimeLimit).then(()=> {
        enroll.stop();
        pause(guildSettings.pauseBeforeDay)
            .then(() => master.startDay());
      });
    });
  },
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type == 'DM') return;
    this.start(msg);
  },
};

