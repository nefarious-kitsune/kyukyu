const fs = require('fs');
const {locale} = require('../../res/res');

module.exports = {
  name: 'troops',
  description: locale.COMMAND_TROOPS_DESC,
  usage: locale.COMMAND_TROOPS_USAGE,
  args: true,
  async execute(msg, args) {
    const troopsName = args[0].toLowerCase();
    const blackList = locale.COMMAND_TROOPS_BLACKLIST.split(',');

    if (blackList.includes(troopsName)) {
      msg.reply(locale.NO_COMMENT);
      return;
    }

    const jsonFiles = fs.readdirSync(__dirname)
        .filter((file) => file.endsWith('.json'));
    if (jsonFiles.includes(`${troopsName}.json`)) {
      const embed = JSON.parse(
          fs.readFileSync(`${__dirname}/${troopsName}.json`)
      );

      if (!embed.hasOwnProperty('footer')) {
        embed['footer'] = locale.EMBED_FOOTER;
      }

      msg.channel.send(embed);
    } else {
      msg.reply(locale.NO_INFO.replace('%1%', troopsName));
      return;
    }
  },
};
