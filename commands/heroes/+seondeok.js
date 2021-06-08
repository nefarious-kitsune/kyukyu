const {literal} = require('../../helpers/literal');
const {formatNumber} = require('../../helpers/formatNumber');
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

    const additionalDamage = Math.round(troops.basic.health * 0.05);
    const equivAttackIncrease =
            additionalDamage / (troops.basic.attack - troops.basic.defense);

    let text =
      literal(cmdRes.responseIntro,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      ) +
      cmdRes.responseOpening +
      literal(cmdRes.responseOpeningDamage,
          '{ATTACK}', troops.basic.attack,
          '{ADD DAMAGE}', additionalDamage,
          '{EQUIV INCREASE}', formatNumber(equivAttackIncrease * 100, 0),
      );

    if ((troops.basic.attack_type == 'melee') &&
      (troops.basic.damage_shape == 'single')) {
      const radius = (aoeRanges[heroLevel-1]/5); // diameter
      const area = radius * radius * 3.14;
      const aoeDamage = aoeRatios[heroLevel-1] * troops.basic.attack;
      text +=
        literal(cmdRes.responseOpeningAoE,
            '{AOE RADIUS}', formatNumber(radius, 1),
            '{AOE AREA}', formatNumber(area, 1),
            '{AOE ATTACK}', formatNumber(aoeDamage, 0),
        );
    }

    text +=
        cmdRes.responseNormal +
        literal(cmdRes.responseNormalAttack,
            '{ATTACK}', troops.basic.attack,
        );
    if (troops.basic.damage_shape) {
      if (troops.basic.damage_shape == 'rounded') {
        const radius = Number(troops.basic.damage_range);
        const area = radius * radius * 3.14;
        text +=
          literal(cmdRes.responseNormalCircle,
              '{AOE RADIUS}', formatNumber(radius, 1),
              '{AOE AREA}', formatNumber(area, 1),
          );
      } else if (troops.basic.damage_shape == 'rectangular') {
        const w = Number(troops.basic.damage_range[0]);
        const l = Number(troops.basic.damage_range[1]);
        const area = w * l;
        text +=
          literal(cmdRes.responseNormalRect,
              '{AOE W}', formatNumber(w, 1),
              '{AOE L}', formatNumber(l, 1),
              '{AOE AREA}', formatNumber(area, 1),
          );
      }
    }

    sendMessage(msg.channel, text, msg.author.id);
  },
};
