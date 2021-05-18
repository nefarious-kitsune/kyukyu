const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');
const {plusHero} = require('../../helpers/plusHero');

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
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const {heroLevel, troops, troopsLevel, troopsDisplayName} =
        plusHero(settings, args);

    const equivAttackIncrease =
        Math.round(
            100 *
            (troops.basic.health * 0.05) /
            (troops.basic.attack - troops.basic.defense),
        );

    let text =
      literal(cmdRes.responseIntro,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      ) +
      cmdRes.responseOpening +
      literal(cmdRes.responseOpeningDamage,
          '{ATTACK}', troops.basic.attack,
          '{ADD DAMAGE}', Math.round(troops.basic.health * 0.05),
          '{EQUIV INCREASE}', equivAttackIncrease,
      );

    if ((troops.basic.attack_type == 'melee') &&
      (troops.basic.damage_shape == 'single')) {
      const range = (aoeRanges[heroLevel-1]/5); // diameter
      const area = Math.round(range * range * 0.25 * 3.14 *10)/10;
      text +=
        literal(cmdRes.responseOpeningAoE,
            '{AOE RADIUS}', range/2,
            '{AOE AREA}', area,
            '{AOE ATTACK}', aoeRatios[heroLevel-1] * troops.basic.attack,
        );
    }

    text +=
        cmdRes.responseNormal +
        literal(cmdRes.responseNormalAttack,
            '{ATTACK}', troops.basic.attack,
        );
    if (troops.basic.damage_shape) {
      if (troops.basic.damage_shape == 'rounded') {
        const range = (troops.basic.damage_range);
        const area = Math.round(range * range * 0.25 * 3.14 * 10)/10;
        text +=
          literal(cmdRes.responseNormalCircle,
              '{AOE RADIUS}', range/2,
              '{AOE AREA}', area,
          );
      } else if (troops.basic.damage_shape == 'rectangular') {
        const w = troops.basic.damage_range[0];
        const l = troops.basic.damage_range[1];
        const area = Math.round(w * l *10)/10;
        text +=
          literal(cmdRes.responseNormalRect,
              '{AOE W}', w,
              '{AOE L}', l,
              '{AOE AREA}', area,
          );
      }
    }

    sendMessage(msg.channel, text, msg.author.id);
  },
};
