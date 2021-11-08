const fs = require('fs');
const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {getEmbed} = require('../../helpers/getEmbed');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'troops',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const troopsName = res.findTroops(settings.lang, args[0]);
    const blackList = cmdRes.blackList.split(',');

    if (blackList.includes(troopsName)) {
      msg.channel.send({
        content: l10n.NO_COMMENT,
        reply: {messageReference: msg.id},
      });
      return;
    }
    if (troopsName && cmdRes.files.hasOwnProperty(troopsName)) {
      const embed = getEmbed(settings, cmdRes.files[troopsName]);
      embed.thumbnail = {'url': res.images.troops_icons[troopsName]};
      sendMessage(msg.channel, {embeds: [embed]}, msg.author.id);
    } else {
      msg.channel.send({
        content: literal(l10n.NO_INFO, '{TEXT}', args[0].trim()),
        reply: {messageReference: msg.id},
      });
      return;
    }
  },
};
