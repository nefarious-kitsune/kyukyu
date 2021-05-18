const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');
const {plusHero} = require('../../helpers/plusHero');

const MAX_VOODOO_DAMAGE = 17500;
const MAX_VOODOO_HEALTH = 4375;

const immunities = [
  0.16, 0.17, 0.18, 0.19, 0.20,
  0.21, 0.22, 0.23, 0.24, 0.25,
  0.26, 0.27, 0.28, 0.29, 0.30,
];

const regen = [
  0.010, 0.010, 0.010, 0.010, // 1-4
  0.015, 0.015, 0.015, 0.015, // 5-8
  0.020, 0.020, // 9-10
  0.022, 0.024, 0.026, 0.028, 0.030,
];

module.exports = {
  name: '+arthur',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const {heroLevel, troops, troopsLevel, troopsDisplayName} =
        plusHero(settings, args);

    let text =
      literal(cmdRes.responseIntro,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      );

    if (troops.race == 'human') {
      const immunPercentage = immunities[heroLevel-1] * 100;
      const healthRegen = Math.round(regen[heroLevel-1] * troops.basic.health);

      const voodooDamage =
          Math.round(
              (MAX_VOODOO_HEALTH + MAX_VOODOO_DAMAGE - troops.basic.defense) *
              (1-immunities[heroLevel-1]),
          );

      const healthPercentage =
          Math.round(100 * voodooDamage / troops.basic.health);

      text +=
          literal(cmdRes.responsePassive,
              '{IMMUNITY PERCENTAGE}', immunPercentage,
              '{HEALTH REGEN}', healthRegen,
          ) +
          literal(cmdRes.responseCursed,
              '{DAMAGE}', voodooDamage,
              '{HEALTH PERCENTAGE}', healthPercentage,
          );
    } else {
      text += cmdRes.responseTroopsNotHuman;
    }

    sendMessage(msg.channel, text, msg.author.id);
  },
};
