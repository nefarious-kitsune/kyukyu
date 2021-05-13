const fs = require('fs');
const res = require('../../res/res');
const {images, locale} = res;
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'hero',
  description: locale.COMMAND_HERO_DESC,
  usage: locale.COMMAND_HERO_USAGE,
  aliases: locale.COMMAND_HERO_ALIASES,
  args: true,
  async execute(msg, args) {
    const heroName = res.findHero(args[0]);
    if (heroName == false) return;

    if (locale.COMMAND_HERO_MAP.hasOwnProperty(heroName)) {
      const content = JSON.parse(
          fs.readFileSync(locale.COMMAND_HERO_MAP[heroName]),
      );
      if (!content.embed.hasOwnProperty('footer')) {
        content.embed['footer'] = {text: locale.EMBED_FOOTER};
      } else {
        content.embed.footer.text =
          literal(content.embed.footer.text, '{PREFIX}', process.env.prefix);
      }
      content.embed.thumbnail = {'url': images.hero_icons[heroName]};
      sendMessage(msg.channel, content, msg.author.id);
    } else {
      msg.reply(
          literal(locale.NO_INFO, '{TEXT}', heroName),
      );
      return;
    }
  },
};
