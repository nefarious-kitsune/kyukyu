const fs = require('fs');

module.exports = {
  name: 'purchase',
  aliases: ['purchasing'],
  description: 'Help with purchases.',
  async execute(msg, args) {
    const embed = JSON.parse(fs.readFileSync(__dirname + '/purchase.json'));
    msg.channel.send(embed);
  },
};
