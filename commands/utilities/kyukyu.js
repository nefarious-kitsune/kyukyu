const guildConfig = require('../../helpers/config');

module.exports = {
  name: 'kyukyu',
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type !== 'text') {
      throw new Error('Cannot execute kyukyu command in none-text channel.');
    }
    if (args.length < 2) {
      const settings = guildConfig.getGuildSettings(msg.guild);

      if (args.length == 1) {
        if (typeof settings[args[0]] === 'undefined') {
          // do nothing
        } else {
          msg.channel.send(settings[args[0]]);
        }
      } else {
        let text = '';
        for (const [k, v] of Object.entries(settings)) {
          if (k !== 'id') {
            text += k + ': ' + v + '\n';
          }
        }
        msg.channel.send(text);
      }
      return;
    }

    const result = guildConfig.setGuild(
        msg.guild,
        args[0].toLowerCase(),
        args.slice(1),
    );

    if (result) {
      await msg.react('✅');
    } else {
      await msg.react('❌');
    }
  },
};
