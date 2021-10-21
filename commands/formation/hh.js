const fs = require('fs');
const {getEmbed} = require('../../helpers/getEmbed');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'hh',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const formName = args[0].toLowerCase().trim();
    if (cmdRes.files.hasOwnProperty(formName)) {
      const embed = getEmbed(settings, cmdRes.files[formName]);
      sendMessage(msg.channel, {embeds: [embed]}, msg.author.id);
    } else {
      // NO_INFO
    }
  },
};
