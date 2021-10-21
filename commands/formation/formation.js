const {getEmbed} = require('../../helpers/getEmbed');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'formation',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const formName = args[0].toLowerCase().trim();
    if (cmdRes.files.hasOwnProperty(formName)) {
      const content = {embeds: [getEmbed(settings, cmdRes.files[formName])]};
      sendMessage(msg.channel, content, msg.author.id);
    } else {
      // NO_INFO
    }
  },
};
