const fs = require('fs');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');
const {touchEmbed} = require('../../helpers/touchEmbed');

module.exports = {
  name: 'info',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const keyword = args[0].toLowerCase().trim();
    let item = false;
    for (let i = 0; i < cmdRes.items.length; i++) {
      if (cmdRes.items[i].aliases.includes(keyword)) {
        item = cmdRes.items[i];
        break;
      }
    }
    if (!item) return;

    const contents = [];
    item.files.forEach( (fPath) => {
      fileContent = fs.readFileSync(fPath, 'utf8');
      if (fPath.endsWith('.json')) {
        contents.push(JSON.parse(fileContent));
      } else {
        contents.push(literal(fileContent, '{PREFIX}', settings.prefix));
      }
    });
    const lastContent = contents[contents.length-1];
    if (typeof lastContent !== 'string') touchEmbed(settings, lastContent);
    const channel = item.dm?msg.author:msg.channel;
    contents.forEach( (c) => {
      sendMessage(channel, c, msg.author.id);
    });
  },
};
