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

    if (Number.isNaN(heroLevel)||(heroLevel < 0)||(heroLevel > 15)) return;
    if (Number.isNaN(troopsLevel)||(troopsLevel < 0)||(troopsLevel > 9)) return;

    const troopsDisplayName = locale.TROOPS_DISPLAY_NAMES[troopsName];
    troops = troopsStats(troopsName, troopsLevel);

    const equivAttackIncrease =
        Math.round(
            100 *
            (troops.basic.health * 0.05) /
            (troops.basic.attack - troops.basic.defense)
        );

    let text =
      literal(
          locale.COMMAND_PLUS_SEONDEOK_INTRO,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      );
    text +=
      literal(
          locale.COMMAND_PLUS_SEONDEOK_DAMAGE,
          '{ATTACK}', troops.basic.attack,
          '{ADD DAMAGE}', Math.round(troops.basic.health * 0.05),
          '{EQUIV INCREASE}', equivAttackIncrease,
      );

    if ((troops.basic.attack_type == 'melee') &&
      (troops.basic.damage_shape == 'single')) {
      text +=
        literal(
            locale.COMMAND_PLUS_SEONDEOK_AOE,
            '{AOE RANGE}', (aoeRanges[heroLevel-1]/5),
            '{AOE ATTACK}', aoeRatios[heroLevel-1] * troops.basic.attack,
        );
    }

    msg.channel.send(text);
  },
};
