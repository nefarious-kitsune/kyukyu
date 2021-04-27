const fs = require('fs');
const {locale} = require('../../res/res');
const {literal} = require('../../helpers/literal');

module.exports = {
  name: 'troops',
  description: locale.COMMAND_TROOPS_DESC,
  usage: locale.COMMAND_TROOPS_USAGE,
  aliases: locale.COMMAND_TROOPS_ALIASES,
  args: true,
  async execute(msg, args) {
    const troopsName = args[0].toLowerCase();
    const blackList = locale.COMMAND_TROOPS_BLACKLIST.split(',');

    if (blackList.includes(troopsName)) {
      msg.reply(locale.NO_COMMENT);
      return;
    }
    if (locale.COMMAND_TROOPS_MAP.hasOwnProperty(troopsName)) {
      const embed = JSON.parse(
          fs.readFileSync(locale.COMMAND_TROOPS_MAP[troopsName])
      );
      if (!embed.embed.hasOwnProperty('footer')) {
        embed.embed['footer'] = {text: locale.EMBED_FOOTER};
      }
      msg.channel.send(embed);
    } else {
      msg.reply(
          literal(locale.NO_INFO, '{1}', troopsName)
      );
      return;
    }
  },
};
