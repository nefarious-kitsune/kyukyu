const fs = require('fs');

module.exports = {
  name: 'troops',
  description: 'Information about troops',
  usage: '<troops name>',
  args: true,
  async execute(msg, args) {
    const noComment = [
      'infantry',
      'iron guards',
      'hell jailers',
      'fire mage',
      'viking warrior',
      'scholar',
      'templar knight'
    ];
    const troopsName = args.join(' ').toLowerCase();
    if (noComment.includes(troopsName)) {
      msg.reply(`I have no comment.`);
      return;
    }

    const jsonFiles = fs.readdirSync(__dirname)
        .filter((file) => file.endsWith('.json'));
    if (jsonFiles.includes(`${troopsName}.json`)) {
      const embed = JSON.parse(
          fs.readFileSync(`${__dirname}/${troopsName}.json`)
      );

      // if (!embed.hasOwnProperty('footer')) {
      //   embed['footer'] = {text: ''};
      // }

      msg.channel.send(embed);
    } else {
      msg.reply(`I have no information for "${troopsName}"`);
      return;
    }
  },
};
