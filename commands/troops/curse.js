const res = require('../../res/res');
const locale = res.locale;
const {troopsData} = require('../../helpers/troopsData');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

const VOODOO_CURSE_RATE =
  [1, 0.58, 0.34, 0.20, 0.011, 0.066, 0.038, 0.022, 0.013];

module.exports = {
  name: 'curse',
  description: locale.COMMAND_CURSE_DESC,
  usage: locale.COMMAND_CURSE_USAGE,
  usage_example: locale.COMMAND_CURSE_USAGE_EXAMPLE,
  aliases: locale.COMMAND_CURSE_ALIASES,
  args: true,
  async execute(msg, args) {
    if ((args.length != 2) && (args.length != 4)) return;

    const targetName = res.findTroops(args[0]);
    if (targetName == false) return;

    const targetLevel = parseInt(args[1]);
    if (Number.isNaN(targetLevel)||(targetLevel<0)||(targetLevel>9)) return;

    let curserName;
    let curserLevel;
    if (args.length == 4) {
      curserName = res.findTroops(args[2]);
      if (curserName == false) return;
      curserLevel = parseInt(args[3]);
      if (Number.isNaN(curserLevel)||(curserLevel<0)||(curserLevel>9)) return;
    } else {
      curserName = 'voodoo dolls';
      curserLevel = 9;
    }

    const targetDisplayName = locale.TROOPS_DISPLAY_NAMES[targetName];
    // const curserDisplayName = locale.TROOPS_DISPLAY_NAMES[curserName];
    curser = troopsData(curserName, curserLevel);
    target = troopsData(targetName, targetLevel);
    if ((curser === null) || (target === null)) return;

    if (curserName == 'voodoo dolls') {
      if (targetName == 'voodoo dolls') {
        msg.channel.send(locale.COMMAND_CURSE_VOODOO_CANNOT_BE_CURSED);
        return;
      }
      const damageFromHealthLoss = curser.basic.health;
      const damageFromCurse = curser.skill.damage - target.basic.defense;

      let voodooDamage;
      if ((target.skill) && (target.skill.damage_resistance)) {
        voodooDamage = Math.round(
            (damageFromHealthLoss + damageFromCurse) *
            (1-target.skill.damage_resistance),
        );
      } else {
        voodooDamage = damageFromHealthLoss + damageFromCurse;
      }

      const healthPercentage =
          Math.round((voodooDamage / target.basic.health) * 100);

      const levelDifference =
          (targetLevel > curserLevel)?
          targetLevel - curserLevel:
          0;
      const curseRate =
          Math.round(VOODOO_CURSE_RATE[levelDifference] * 100);

      const text =
        literal(
            locale.COMMAND_CURSE_VOODOO,
            '{VOODOO LEVEL}', curserLevel,
            '{TARGET}', targetDisplayName,
            '{TARGET LEVEL}', targetLevel,
            '{RATE}', curseRate,
            '{DAMAGE}', voodooDamage,
            '{HEALTH PERCENTAGE}', healthPercentage,
        );
      // sendMessage(msg.channel, text, msg.author.id);
      sendMessage(msg.channel, text, msg.author.id);
    } else {

    }
  },
};
