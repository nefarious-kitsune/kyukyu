const res = require('../../res/res');
const locale = res.locale;
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');
const {plusHero} = require('../../helpers/plusHero');

const MAX_VOODOO_DAMAGE = 17500;
const MAX_VOODOO_HEALTH = 4375;

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
  description: locale.COMMAND_PLUS_SELENE_DESC,
  usage: locale.COMMAND_PLUS_SELENE_USAGE,
  usage_example: locale.COMMAND_PLUS_SELENE_USAGE_EXAMPLE,
  aliases: locale.COMMAND_PLUS_SELENE_ALIASES,
  args: true,
  async execute(msg, args) {
    const {heroLevel, troops, troopsName, troopsLevel, troopsDisplayName} =
        plusHero(args);

    const buffedAttck =
      Math.round(troops.basic.attack * (1+attackBuffs[heroLevel-1]));
    const buffPercentage =
      Math.round(attackBuffs[heroLevel-1]*100);

    let text =
      literal(
          locale.COMMAND_PLUS_SELENE_INTRO,
          '{TROOPS}', troopsDisplayName,
          '{TROOPS LEVEL}', troopsLevel,
          '{HERO LEVEL}', heroLevel,
      ) +
      literal(
          locale.COMMAND_PLUS_SELENE_OPENING,
          '{DURATION}', durations[heroLevel-1],
      ) +
      literal(
          locale.COMMAND_PLUS_SELENE_OPENING_ATK,
          '{ATTACK}', buffedAttck,
          '{INCREASE}', buffPercentage,
      );

    if (troopsName != 'voodoo dolls') {
      const voodooDamage =
          Math.round(
              (MAX_VOODOO_HEALTH + MAX_VOODOO_DAMAGE - troops.basic.defense) *
              (1-immunities[heroLevel-1]),
          );

      const healthPercentage =
          Math.round(100 * voodooDamage / troops.basic.health);

      text +=
        literal(
            locale.COMMAND_PLUS_SELENE_OPENING_CURSED,
            '{DAMAGE}', voodooDamage,
            '{HEALTH PERCENTAGE}', healthPercentage,
        );
    }

    sendMessage(msg.channel, text, msg.author.id);
  },
};
