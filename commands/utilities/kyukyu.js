const guildConfig = require('../../helpers/config');
const {safeReact} = require('../../helpers/safeReact');
const res = require('../../res/res');
const {Permissions} = require('discord.js');

module.exports = {
  name: 'kyukyu',
  async execute(cmdRes, settings, msg, args) {
    // Special case: silent return
    if (args.length == 0) return;

    if (msg.channel.type !== 'GUILD_TEXT') {
      throw new Error('Cannot execute kyukyu command in none-text channel.');
    }

    if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      throw new Error('Administrator permission needed.');
    }

    if (args.length < 2) {
      const settings = guildConfig.getGuildSettings(msg.guild);

      const param = args[0].toLowerCase().trim();
      switch (param) {
        case 'prefix':
          msg.channel.send(`prefix: ${settings.prefix}`);
          break;
        case 'bot-channel':
          if (settings['bot-channel'].length > 0) {
            const list = settings['bot-channel']
                .map((v)=>`<#${v}>`)
                .join(', ');
            msg.channel.send(`bot-channel: ${list}`);
          } else {
            msg.channel.send(`bot-channel: All`);
          }
          break;
        case 'lang':
          msg.channel.send(`lang: ${settings.lang}`);
          break;
        case 'disable':
          if (settings.disable.length > 0) {
            const list =
              settings.disable.map(
                  (v) => res.getCommandRes(settings.lang, v).aliases[0],
              ).join(', ');
            msg.channel.send(`disable: ${list}`);
          } else {
            msg.channel.send(`disable: None`);
          }
          break;
        default:
      } // switch (param)
      return;
    }

    const result = guildConfig.setGuild(
        msg.guild,
        args[0].toLowerCase(),
        args.slice(1),
    );
    msg.channel.send({
      content: cmdRes.commandNotFound,
      reply: {messageReference: msg.id},
    });
    if (result) {
      safeReact(msg, '✅', null, () => {
        msg.channel.send({
          content: '✅',
          reply: {messageReference: msg.id},
        });
      });
    } else {
      safeReact(msg, '❌', null, () => {
        msg.channel.send({
          content: '❌',
          reply: {messageReference: msg.id},
        });
      });
    }
  },
};
