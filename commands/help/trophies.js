const {locale} = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'trophies',
  description: locale.COMMAND_TROPHIES_DESC,
  usage: locale.COMMAND_TROPHIES_USAGE,
  usage_example: locale.COMMAND_TROPHIES_USAGE_EXAMPLE,
  aliases: locale.COMMAND_TROPHIES_ALIASES,
  args: true,
  async execute(msg, args) {
    if (args.length < 2) return;
    myTrophies = parseInt(args[0]);
    oppTrophies = parseInt(args[1]);
    if (Number.isNaN(myTrophies) || Number.isNaN(oppTrophies)) return;

    const delta =
      32 / (1 + Math.exp(-0.0023* (oppTrophies - myTrophies) ));

    let gain = Math.round(delta);
    if (gain < 0) gain = 1;

    let loss = -Math.floor(delta/2);
    if (loss > -1) loss = -1;

    const text =
      literal(
          locale.COMMAND_TROPHIES_RESULT,
          '{GAIN}', gain,
          '{LOSS}', loss,
      );

    sendMessage(msg.channel, text, msg.author.id);
  },
};
