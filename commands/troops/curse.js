const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {formatNumber} = require('../../helpers/formatNumber');
const {sendMessage} = require('../../helpers/sendMessage');
const {troopsData} = require('../../helpers/troopsData');

const MAX_TROOPS_LEVEL = 10;
const DEF_TROOPS_LEVEL = 9;
const VOODOO_CURSE_RATE =
  [1, 0.58, 0.34, 0.20, 0.011, 0.066, 0.038, 0.022, 0.013, 0.007];

module.exports = {
  name: 'curse',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const targetName = res.findTroops(settings.lang, args[0]);
    if (!targetName) return;

    let argIdx = 1;
    let targetLevel;
    if (args.length == argIdx) {
      targetLevel = DEF_TROOPS_LEVEL;
    } else {
      targetLevel = parseInt(args[argIdx]);
      if (Number.isNaN(targetLevel)) {
        targetLevel = DEF_TROOPS_LEVEL;
      } else if ((targetLevel >=1) && (targetLevel <= MAX_TROOPS_LEVEL)) {
        argIdx++;
      } else {
        return;
      }
    }

    let curserName;
    let curserLevel;
    if (args.length > argIdx) {
      curserName = res.findTroops(settings.lang, args[argIdx]);
      if (!curserName) {
        curserName = 'voodoo dolls';
        curserLevel = DEF_TROOPS_LEVEL;
      } else {
        argIdx++;
        if (args.length == argIdx) {
          curserLevel = DEF_TROOPS_LEVEL;
        } else {
          curserLevel = parseInt(args[argIdx]);
          if (Number.isNaN(curserLevel)) {
            curserLevel = DEF_TROOPS_LEVEL;
          } else if ((curserLevel >=1) && (curserLevel <= MAX_TROOPS_LEVEL)) {
            //
          } else {
            return;
          }
        }
      }
    } else {
      curserName = 'voodoo dolls';
      curserLevel = DEF_TROOPS_LEVEL;
    }

    const targetDisplayName = l10n.TROOPS_DISPLAY_NAMES[targetName];
    curser = troopsData(settings.lang, curserName, curserLevel);
    target = troopsData(settings.lang, targetName, targetLevel);
    if ((curser === null) || (target === null)) return;

    if (curserName == 'voodoo dolls') {
      if (targetName == 'voodoo dolls') {
        msg.channel.send(cmdRes.responseVoodooCannotBeCurse);
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
        if ((target.race == 'human') && (curserLevel == 10)) {
          voodooDamage = Math.round(voodooDamage * 1.05);
        }
      }

      const healthRatio = voodooDamage / target.basic.health;

      const levelDifference =
          (targetLevel > curserLevel)?
          targetLevel - curserLevel:
          0;
      const curseRate = VOODOO_CURSE_RATE[levelDifference];

      const text =
        literal(cmdRes.responseVoodoo,
            '{VOODOO LEVEL}', curserLevel,
            '{TARGET}', targetDisplayName,
            '{TARGET LEVEL}', targetLevel,
            '{RATE}', formatNumber(curseRate * 100, 0),
            '{DAMAGE}', voodooDamage,
            '{HEALTH PERCENTAGE}', formatNumber(healthRatio * 100, 0),
        );
      // sendMessage(msg.channel, text, msg.author.id);
      sendMessage(msg.channel, text, msg.author.id);
    } else {

    }
  },
};
