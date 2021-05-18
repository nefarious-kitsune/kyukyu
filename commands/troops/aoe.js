const {images} = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'aoe',
  args: true,
  async execute(cmdRes, settings, msg, args) {
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

    msg.reply(literal(res.l10n[settings.lang].NO_INFO, '{TEXT}', unitName));
  },
};