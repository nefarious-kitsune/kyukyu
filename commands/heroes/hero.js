const fs = require('fs');
const {locale} = require('../../res/res');
const {literal} = require('../../helpers/literal');

module.exports = {
  name: 'hero',
  description: locale.COMMAND_HERO_DESC,
  usage: locale.COMMAND_HERO_USAGE,
  aliases: locale.COMMAND_HERO_ALIASES,
  args: true,
  async execute(msg, args) {
    const heroName = args[0].toLowerCase();
    if (locale.COMMAND_HERO_MAP.hasOwnProperty(heroName)) {
      const embed = JSON.parse(
          fs.readFileSync(locale.COMMAND_HERO_MAP[heroName])
      );
      if (!embed.embed.hasOwnProperty('footer')) {
        embed.embed['footer'] = {text: locale.EMBED_FOOTER};
      }
      msg.channel.send(embed);
    } else {
      msg.reply(
          literal(locale.NO_INFO, '{1}', heroName)
      );
      return;
    }
  },
};
