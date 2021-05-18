const res = require('../../res/res');
const {images, locale} = res;
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'aoe',
  description: locale.COMMAND_AOE_DESC,
  usage: locale.COMMAND_AOE_USAGE,
  usage_example: locale.COMMAND_AOE_USAGE_EXAMPLE,
  aliases: locale.COMMAND_AOE_ALIASES,
  args: true,
  async execute(settings, msg, args) {
    let unitName = res.findHero(args[0]);
    if (unitName) {
      const url = images.hero_aoe[unitName];
      if (url && url.length > 0) {
        sendMessage(msg.channel, url, msg.author.id);
        return;
      }
    } else {
      unitName = res.findTroops(args[0]);
      if (unitName) {
        const url = images.troops_aoe[unitName];
        if (url && url.length > 0) {
          sendMessage(msg.channel, url, msg.author.id);
          return;
        }
      }
    }

    msg.reply(literal(locale.NO_INFO, '{TEXT}', unitName));
  },
};
