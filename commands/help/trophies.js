const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'trophies',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type != 'dm') return;

    if (args.length < 2) return;
    myTrophies = parseInt(args[0]);
    oppTrophies = parseInt(args[1]);
    if (Number.isNaN(myTrophies) || Number.isNaN(oppTrophies)) return;

    const delta1 = 32 / (1 + Math.exp(-0.0023* (oppTrophies - myTrophies) ));
    let myGain = Math.round(delta1);
    if (myGain < 0) myGain = 1;
    let oppLoss = -Math.floor(delta1/2);
    if (oppLoss > -1) oppLoss = -1;

    const delta2 = 32 / (1 + Math.exp(-0.0023* (myTrophies - oppTrophies) ));
    let oppGain = Math.round(delta2);
    if (oppGain < 0) oppGain = 1;
    let myLoss = -Math.floor(delta2/2);
    if (myLoss > -1) myLoss = -1;

    const text =
      literal(
          cmdRes.response,
          '{MY GAIN}', myGain,
          '{MY LOSS}', myLoss,
          '{OPP GAIN}', oppGain,
          '{OPP LOSS}', oppLoss,
      );

    sendMessage(msg.channel, text, msg.author.id);
  },
};
