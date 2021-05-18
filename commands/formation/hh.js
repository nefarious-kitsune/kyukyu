const fs = require('fs');
const {touchEmbed} = require('../../helpers/touchEmbed');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'hh',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const formName = args[0].toLowerCase().trim();
    if (cmdRes.files.hasOwnProperty(formName)) {
      const content = JSON.parse(fs.readFileSync(cmdRes.files[formName]));
      touchEmbed(settings, content);
      sendMessage(msg.channel, content, msg.author.id);
    } else {
      // NO_INFO
    }
  },
};
