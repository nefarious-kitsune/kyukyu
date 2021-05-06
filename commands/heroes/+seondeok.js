const res = require('../../res/res');
const locale = res.locale;
const {troopsData} = require('../../helpers/troopsData');
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
    if (troopsName == false) return;

    const troopsDisplayName = locale.TROOPS_DISPLAY_NAMES[troopsName];
    troops = troopsData(troopsName, troopsLevel);
    if (troops === null) return;

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
      ) +
      locale.COMMAND_PLUS_SEONDEOK_OPENING +
      literal(
          locale.COMMAND_PLUS_SEONDEOK_OPENING_DMG,
          '{ATTACK}', troops.basic.attack,
          '{ADD DAMAGE}', Math.round(troops.basic.health * 0.05),
          '{EQUIV INCREASE}', equivAttackIncrease,
      );

    if ((troops.basic.attack_type == 'melee') &&
      (troops.basic.damage_shape == 'single')) {
      const range = (aoeRanges[heroLevel-1]/5); // diameter
      const area = Math.round(range * range * 0.25 * 3.14 *10)/10;
      text +=
        literal(
            locale.COMMAND_PLUS_SEONDEOK_OPENING_AOE,
            '{AOE RADIUS}', range/2,
            '{AOE AREA}', area,
            '{AOE ATTACK}', aoeRatios[heroLevel-1] * troops.basic.attack,
        );
    }

    text +=
        locale.COMMAND_PLUS_SEONDEOK_NORMAL +
        literal(
            locale.COMMAND_PLUS_SEONDEOK_NORMAL_ATTACK,
            '{ATTACK}', troops.basic.attack,
        );
    if (troops.basic.damage_shape) {
      if (troops.basic.damage_shape == 'rounded') {
        const range = (troops.basic.damage_range);
        const area = Math.round(range * range * 0.25 * 3.14 * 10)/10;
        text +=
          literal(
              locale.COMMAND_PLUS_SEONDEOK_NORMAL_CIRCLE,
              '{AOE RADIUS}', range/2,
              '{AOE AREA}', area,
          );
      } else if (troops.basic.damage_shape == 'rectangular') {
        const w = troops.basic.damage_range[0];
        const l = troops.basic.damage_range[1];
        const area = Math.round(w * l *10)/10;
        text +=
          literal(
              locale.COMMAND_PLUS_SEONDEOK_NORMAL_RECT,
              '{AOE W}', w,
              '{AOE L}', l,
              '{AOE AREA}', area,
          );
      }
    }

    msg.channel.send(text);
  },
};
