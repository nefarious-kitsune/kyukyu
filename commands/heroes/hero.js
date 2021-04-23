const fs = require('fs');
const {locale} = require('../../res/res');

module.exports = {
  name: 'hero',
  description: locale.COMMAND_HERO_DESC,
  usage: locale.COMMAND_HERO_USAGE,
  args: true,
  async execute(msg, args) {
    const heroName = args[0].toLowerCase();
    const jsonFiles = fs.readdirSync(__dirname)
        .filter((file) => file.endsWith('.json'));

    if (jsonFiles.includes(`${heroName}.json`)) {
      const embed = JSON.parse(
          fs.readFileSync(`${__dirname}/${heroName}.json`)
      );

      if (!embed.hasOwnProperty('footer')) {
        embed['footer'] = locale.EMBED_FOOTER;
      }

      msg.channel.send(embed);
    } else {
      msg.reply(locale.noInfo(heroName));
      return;
    }
  },
};
