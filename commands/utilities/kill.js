
const {Permissions} = require('discord.js');

module.exports = {
  name: 'kill',
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type !== 'GUILD_TEXT') {
      throw new Error('Cannot execute kyukyu command in none-text channel.');
    }
    if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      throw new Error('Administrator permission needed.');
    }
    process.exit(1);
  },
};
