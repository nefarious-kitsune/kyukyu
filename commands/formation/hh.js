const fs = require('fs');
const {locale} = require('../../res/res');
const {literal} = require('../../helpers/literal');

module.exports = {
  name: 'hh',
  description: locale.COMMAND_HH_DESC,
  usage: locale.COMMAND_HH_USAGE,
  aliases: locale.COMMAND_HH_ALIASES,
  args: true,
  async execute(msg, args) {
    const formName = args[0].toLowerCase();
    if (locale.COMMAND_HH_MAP.hasOwnProperty(formName)) {
      const embed = JSON.parse(
          fs.readFileSync(locale.COMMAND_HH_MAP[formName])
      );
      if (!embed.embed.hasOwnProperty('footer')) {
        embed.embed['footer'] = {text: locale.EMBED_FOOTER};
      } else {
        embed.embed.footer.text =
          literal(embed.embed.footer.text, '{PREFIX}', process.env.prefix);
      }
      msg.channel.send(embed);
    } else {
      msg.reply(
          literal(locale.NO_INFO, '{TEXT}', formName)
      );
      return;
    }
  },
};