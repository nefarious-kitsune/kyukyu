const res = require('../../res/res');
const locale = res.locale;
const {literal} = require('../../helpers/literal');
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
  description: locale.COMMAND_PLUS_ARTHUR_DESC,
  usage: locale.COMMAND_PLUS_ARTHUR_USAGE,
  usage_example: locale.COMMAND_PLUS_ARTHUR_USAGE_EXAMPLE,
  aliases: locale.COMMAND_PLUS_ARTHUR_ALIASES,
  args: true,
  async execute(msg, args) {
    const {heroLevel, troops, troopsLevel, troopsDisplayName} =
        plusHero(args);

    let text =
      literal(
          locale.COMMAND_PLUS_ARTHUR_INTRO,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      );

    if (troops.race == 'human') {
      const immunPercentage = immunities[heroLevel-1] * 100;
      const healthRegen = Math.round(regen[heroLevel-1] * troops.basic.health);

      const voodooDamage =
          Math.round(
              MAX_VOODOO_HEALTH +
              (MAX_VOODOO_DAMAGE - troops.basic.defense) *
              (1-immunities[heroLevel-1])
          );

      const healthPercentage =
          Math.round(100 * voodooDamage / troops.basic.health);

      text +=
          literal(
              locale.COMMAND_PLUS_ARTHUR_PASSIVE,
              '{IMMUNITY PERCENTAGE}', immunPercentage,
              '{HEALTH REGEN}', healthRegen,
          ) +
          literal(
              locale.COMMAND_PLUS_SELENE_OPENING_CURSED,
              '{DAMAGE}', voodooDamage,
              '{HEALTH PERCENTAGE}', healthPercentage,
          );
    } else {
      text += locale.COMMAND_PLUS_ARTHUR_NOT_HUMAN;
    }

    msg.channel.send(text);
  },
};
