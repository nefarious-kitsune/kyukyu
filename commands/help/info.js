const fs = require('fs');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');
const {touchEmbed} = require('../../helpers/touchEmbed');

module.exports = {
  name: 'info',
  async execute(cmdRes, settings, msg, args) {
    if (args.length == 0) {
      let text = literal(cmdRes.response, '{PREFIX}', settings.prefix);
      for (let i = 0; i < cmdRes.items.length; i++) {
        text +=`**${cmdRes.items[i].aliases[0]}**: ${cmdRes.items[i].desc}\n`;
      }
      sendMessage(msg.channel, text, msg.author.id);
      return;
    }

    const keyword = args[0].toLowerCase().trim();
    let item = false;
    for (let i = 0; i < cmdRes.items.length; i++) {
      if (cmdRes.items[i].aliases.includes(keyword)) {
        item = cmdRes.items[i];
        break;
      }
    }
    if (!item) return;

    const embeds = [];
    item.files.forEach( (fPath) => {
      fileContent = fs.readFileSync(fPath, 'utf8');
      embed = JSON.parse(fileContent);
      touchEmbed(settings, embed);
      embeds.push(embed);
    });
    const channel = item.dm?msg.author:msg.channel;
    sendMessage(channel, {embeds: embeds}, msg.author.id);
  },
};
