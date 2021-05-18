const fs = require('fs');
const res = require('../../res/res');
const locale = res.locale;
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'troops',
  description: locale.COMMAND_TROOPS_DESC,
  usage: locale.COMMAND_TROOPS_USAGE,
  aliases: locale.COMMAND_TROOPS_ALIASES,
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const troopsName = res.findTroops(settings.lang, args[0]);
    const blackList = locale.COMMAND_TROOPS_BLACKLIST.split(',');

    if (blackList.includes(troopsName)) {
      msg.reply(locale.NO_COMMENT);
      return;
    }
    if (troopsName && locale.COMMAND_TROOPS_FILES.hasOwnProperty(troopsName)) {
      const embed = JSON.parse(
          fs.readFileSync(locale.COMMAND_TROOPS_FILES[troopsName]),
      );
      if (!embed.embed.hasOwnProperty('footer')) {
        embed.embed['footer'] = {text: l10n.EMBED_FOOTER};
      } else {
        embed.embed.footer.text =
          literal(embed.embed.footer.text, '{PREFIX}', process.env.prefix);
      }
      sendMessage(msg.channel, embed, msg.author.id);
    } else {
      msg.reply(
          literal(res.l10n[settings.lang].NO_INFO, '{TEXT}', args[0].trim()),
      );
      return;
    }
  },
};
