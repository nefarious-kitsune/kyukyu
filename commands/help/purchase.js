const fs = require('fs');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'purchase',
  aliases: ['purchasing'],
  description: 'Help with purchases.',
  async execute(msg, args) {
    const embed = JSON.parse(fs.readFileSync(__dirname + '/purchase.json'));
    sendMessage(msg.channel, embed, msg.author.id);
  },
};
