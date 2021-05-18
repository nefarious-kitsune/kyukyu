const fs = require('fs');
const {sendMessage} = require('../../helpers/sendMessage');
const {touchEmbed} = require('../../helpers/touchEmbed');

module.exports = {
  name: 'building',
  args: false,
  async execute(cmdRes, settings, msg, args) {
    const contents = [];
    cmdRes.files.forEach( (fPath) => {
      contents.push(JSON.parse(fs.readFileSync(fPath)));
    });
    touchEmbed(settings, contents[contents.length-1]);
    embeds.forEach( (embed) => {
      sendMessage(msg.channel, embed, msg.author.id);
    });
  },
};
