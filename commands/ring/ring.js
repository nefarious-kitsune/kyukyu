const fs = require('fs');
const path = require('path');
const {literal} = require('../../helpers/literal');
const {wait} = require('./src/common');
const L10N_EN = require('./en/_l10n');
const Enroll = require('./en/enroll');
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
  async start(gameSettings) {
    const master = new Master(gameSettings, L10N_EN);
    const enroll = new Enroll(gameSettings, master);

    const preannouncement = literal(
        L10N_EN.PREANNOUNCEMENT, '{SECONDS}', gameSettings.pauseBeforeGame);
    const letsgo = literal(
        L10N_EN.LETSGO, '{CHANNEL ID}', gameSettings.gameChannelId);

    generalChannel.send(preannouncement);
    enroll.announce(); // Preload enrollment message (buttons disabled)
    wait(guildSettings.pauseBeforeGame);
    generalChannel.send(letsgo);
    enroll.start(); // Enable buttons
  },
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type == 'DM') return;

    const allSettings = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, './ring.json')),
    );

    // Exit if guild settings cannot be found
    if (!allSettings.hasOwnProperty(msg.guildId)) return;

    // Exit if the command is not executed in game channel
    const guildSettings = allSettings[msg.guildId];
    if (guildSettings.gameChannelId != msg.channelId) return;

    // Exit if the command is not executed by an Fire Starter
    if (!guildSettings.fireStarterIds.includes(msg.author.id)) return;

    const channel = msg.channel;
    const guild = msg.guild;

    const generalChannel =
      await guild.channels.fetch(guildSettings.generalChannelId);
    const role = await guild.roles.fetch(guildSettings.roleId);

    const gameSettings = Object.assign({}, guildSettings);
    gameSettings.generalChannel = generalChannel;
    gameSettings.gameChannel = channel;
    gameSettings.roleName = role.name;
    gameSettings.fireStarter = msg.author;
    this.start(gameSettings);
  },
};

