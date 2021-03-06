const {literal} = require('../../helpers/literal');
const {formatNumber} = require('../../helpers/formatNumber');
const {sendMessage} = require('../../helpers/sendMessage');
const {plusHero} = require('../../helpers/plusHero');

const VOODOO_DAMAGE_10 = 21350;
const VOODOO_HEALTH_10 = 5340;
const VOODOO_DAMAGE_9 = 17500;
const VOODOO_HEALTH_9 = 4375;

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
      const immunity = immunities[heroLevel-1];
      const healthRegen = Math.round(regen[heroLevel-1] * troops.basic.health);

      const voodooDamage =
        (troopsLevel == 10)?
        Math.round(
            (VOODOO_HEALTH_10 + VOODOO_DAMAGE_10 - troops.basic.defense) *
            1.05 * (1-immunity),
        ):
        Math.round(
            (VOODOO_HEALTH_9 + VOODOO_DAMAGE_9 - troops.basic.defense) *
            (1-immunity),
        );

      const healthRatio = voodooDamage / troops.basic.health;

      text +=
          literal(cmdRes.responsePassive,
              '{IMMUNITY PERCENTAGE}', formatNumber(immunity * 100),
              '{HEALTH REGEN}', healthRegen,
          ) +
          literal(cmdRes.responseCursed,
              '{DAMAGE}', voodooDamage,
              '{LEVEL}', (troopsLevel == 10)?10:9,
              '{HEALTH PERCENTAGE}', formatNumber(healthRatio * 100, 0),
          );
    } else {
      text += cmdRes.responseTroopsNotHuman;
    }

    sendMessage(msg.channel, text, msg.author.id);
  },
};
