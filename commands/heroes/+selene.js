const {literal} = require('../../helpers/literal');
const {formatNumber} = require('../../helpers/formatNumber');
const {sendMessage} = require('../../helpers/sendMessage');
const {plusHero} = require('../../helpers/plusHero');

const VOODOO_DAMAGE_10 = 21350;
const VOODOO_HEALTH_10 = 5340;
const VOODOO_DAMAGE_9 = 17500;
const VOODOO_HEALTH_9 = 4375;

const attackBuffs = [
  0.46, 0.47, 0.48, 0.49, 0.50,
  0.51, 0.52, 0.53, 0.54, 0.55,
  0.56, 0.57, 0.58, 0.59, 0.60];

const immunities = [
  0.61, 0.62, 0.63, 0.64, 0.65,
  0.66, 0.67, 0.68, 0.69, 0.70,
  0.71, 0.72, 0.73, 0.74, 0.75,
];

const durations = [
  3, 3, 3,
  4, 4, 4,
  5, 5, 5,
  6, 6, 6,
  7, 7, 7,
];

module.exports = {
  name: '+selene',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const {heroLevel, troops, troopsName, troopsLevel, troopsDisplayName} =
        plusHero(settings, args);

    const immunity = immunities[heroLevel-1];
    const buff = attackBuffs[heroLevel-1];
    const buffedAttck = Math.round(troops.basic.attack * (1 + buff));

    let text =
      literal(cmdRes.responseIntro,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      ) +
      literal(cmdRes.responseOpening,
          '{DURATION}', durations[heroLevel-1],
      ) +
      literal(cmdRes.responseOpeningImmunity,
          '{IMMUNITY PERCENTAGE}', formatNumber(immunity * 100),
      ) +
      literal(cmdRes.responseOpeningAttack,
          '{ATTACK}', buffedAttck,
          '{INCREASE}', formatNumber(buff * 100, 0),
      );

    if (troopsName != 'voodoo dolls') {
      let voodooDamage;
      if (troopsLevel == 10) {
        voodooDamage =
            Math.round(
                (VOODOO_HEALTH_10 + VOODOO_DAMAGE_10 - troops.basic.defense) *
                ((troops.race == 'human')?1.05:1) * (1-immunity),
            );
      } else {
        voodooDamage =
            Math.round(
                (VOODOO_HEALTH_9 + VOODOO_DAMAGE_9 - troops.basic.defense) *
                (1-immunity),
            );
      }

      const healthRatio = voodooDamage / troops.basic.health;

      text +=
        literal(
            cmdRes.responseCursed,
            '{DAMAGE}', voodooDamage,
            '{LEVEL}', (troopsLevel == 10)?10:9,
            '{HEALTH PERCENTAGE}', formatNumber(healthRatio * 100, 0),
        );
    }

    sendMessage(msg.channel, text, msg.author.id);
  },
};
