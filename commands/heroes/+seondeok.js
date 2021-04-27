const res = require('../../res/res');
const locale = res.locale;
const {troopsStats} = require('../../helpers/troopsStats');
const {literal} = require('../../helpers/literal');

const aoeRanges = [
  11, 11, 11,
  12, 12, 12,
  13, 13, 13,
  14, 14, 14,
  15, 15, 15];

const aoeRatios = [
  0.16, 0.16, 0.16,
  0.17, 0.17, 0.17,
  0.18, 0.18, 0.18,
  0.19, 0.19, 0.19,
  0.20, 0.20, 0.20,
];

module.exports = {
  name: '+seondeok',
  description: locale.COMMAND_PLUS_SEONDEOK_DESC,
  usage: locale.COMMAND_PLUS_SEONDEOK_USAGE,
  usage_example: locale.COMMAND_PLUS_SEONDEOK_USAGE_EXAMPLE,
  aliases: locale.COMMAND_PLUS_SEONDEOK_ALIASES,
  args: true,
  async execute(msg, args) {
    if (args.length < 3) return;

    const heroLevel = parseInt(args[0]);
    const troopsName = res.findTroops(args[1]);
    const troopsLevel = parseInt(args[2]);

