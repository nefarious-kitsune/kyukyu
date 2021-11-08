const res = require('../../res/res');
const {images} = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'aoe',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    let unitName = res.findHero(settings.lang, args[0]);
    if (unitName) {
      const url = images.hero_aoe[unitName];
      if (url && url.length > 0) {
        sendMessage(msg.channel, url, msg.author.id);
        return;
      }
    } else {
      unitName = res.findTroops(settings.lang, args[0]);
      if (unitName) {
        const url = images.troops_aoe[unitName];
        if (url && url.length > 0) {
          sendMessage(msg.channel, url, msg.author.id);
          return;
        }
      }
    }
    msg.channel.send({
      content: literal(l10n.NO_INFO, '{TEXT}', unitName),
      reply: {messageReference: msg.id},
    });
  },
};
