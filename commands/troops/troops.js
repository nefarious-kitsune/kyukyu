const fs = require('fs');
const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {touchEmbed} = require('../../helpers/touchEmbed');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'troops',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const troopsName = res.findTroops(settings.lang, args[0]);
    const blackList = cmdRes.blackList.split(',');

    if (blackList.includes(troopsName)) {
      msg.reply(l10n.NO_COMMENT);
      return;
    }
    if (troopsName && cmdRes.files.hasOwnProperty(troopsName)) {
      const content = JSON.parse(
          fs.readFileSync(cmdRes.files[troopsName]),
      );
      touchEmbed(settings, content);
      sendMessage(msg.channel, content, msg.author.id);
    } else {
      msg.reply(
          literal(l10n.NO_INFO, '{TEXT}', args[0].trim()),
      );
      return;
    }
  },
};
