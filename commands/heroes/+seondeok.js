const Discord = require('discord.js');
const {literal} = require('../../helpers/literal');
const {formatNumber} = require('../../helpers/formatNumber');
const {sendMessage} = require('../../helpers/sendMessage');
const {plusHero} = require('../../helpers/plusHero');

const AOE_RANGES = [
  11, 11, 11,
  12, 12, 12,
  13, 13, 13,
  14, 14, 14,
  15, 15, 15];

const AOE_RATIOS = [
  0.16, 0.16, 0.16,
  0.17, 0.17, 0.17,
  0.18, 0.18, 0.18,
  0.19, 0.19, 0.19,
  0.20, 0.20, 0.20,
];

const passiveDurations = [
  5.0, 5.2, 5.4, 5.6, 5.8,
  6.0, 6.2, 6.4, 6.6, 6.8,
  7.0, 7.2, 7.4, 7.7, 8.0,
];

/*
const activeDurations = 6;

const cooldowns = [
  16, 16, 16, 16, 16,
  15, 15, 15, 15, 15,
  14, 14, 14, 14, 14,
];
*/

const timeImages = [
  'https://cdn.discordapp.com/attachments/833978786395586600/854558991937830922/skill-time-seon-11.png',
  'https://cdn.discordapp.com/attachments/833978786395586600/854558993300193290/skill-time-seon-12.png',
  'https://cdn.discordapp.com/attachments/833978786395586600/854558997448491022/skill-time-seon-13.png',
  'https://cdn.discordapp.com/attachments/833978786395586600/854558996845428737/skill-time-seon-14.png',
  'https://cdn.discordapp.com/attachments/833978786395586600/854558989105627136/skill-time-seon-15.png',
];

const DMG_INCREASES = [0.04, 0.08, 0.12, 0.16, 0.20];

module.exports = {
  name: '+seondeok',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const {heroLevel, troops, troopsLevel, troopsDisplayName} =
        plusHero(settings, args);

    const embed = new Discord.MessageEmbed().setDescription(
        literal(
            cmdRes.responseIntro,
            '{TROOPS}', troopsDisplayName,
            '{TROOPS LEVEL}', troopsLevel,
            '{HERO LEVEL}', heroLevel,
        ),
    );

    // const passiveStart = 0;
    const passiveEnd = formatNumber(passiveDurations[heroLevel-1], 1);
    const activeStart = '2.8'; // cooldown/5
    // const acitveEnd = '8.8'; // activeStart + 6

    const damageIncrease = (heroLevel >= 11)?DMG_INCREASES[heroLevel-11]:0;

    const multiplier = (heroLevel >= 11)?(1 + damageIncrease):1;

    const attack = troops.basic.attack;
    const health = troops.basic.health;
    const openingAttack = attack + Math.round(health * 0.05);
    // const equivNormalIncrease = openingAttack / attack;
    let h1 = '';
    let h2 = '';
    let h3 = '';
    let t1 = '';
    let t2 = '';
    let t3 = '';

    t1 = literal(cmdRes.responsePassiveTarget,
        '{ATTACK}', openingAttack);

    if (heroLevel >= 11) {
      h1 = literal(cmdRes.responsePassiveHeader,
          '{Passive End}', activeStart);
      h2 = literal(cmdRes.responseAwakenedDoubleHeader,
          '{END}', passiveEnd);
      t2 = literal(cmdRes.responseAwakenedDoubleTarget,
          '{ATTACK}', openingAttack,
          '{MULTIPLIER}', multiplier);
      h3 = literal(cmdRes.responseAwakenedLegendaryHeader,
          '{START}', passiveEnd);
      t3 = literal(cmdRes.responseAwakenedLegendaryTarget,
          '{ATTACK}', attack,
          '{MULTIPLIER}', multiplier);
      embed.setImage(timeImages[heroLevel-11]);
    } else {
      h1 = literal(cmdRes.responsePassiveHeader,
          '{Passive End}', passiveEnd);
    }

    if (troops.basic.attack_type == 'melee') {
      const aoeRatio = AOE_RATIOS[heroLevel-1];

      let basicIsAoe = false;
      switch (troops.basic.damage_shape) {
        case 'single':
          basicIsAoe = false;
          t1 += '\n'+
            literal(cmdRes.responsePassiveSplash2,
                '{ATTACK}', openingAttack,
                '{MULTIPLIER}', formatNumber(aoeRatio, 2),
            ) + '\n'+
            literal(cmdRes.responsePassiveSplashCircle,
                '{AOE RADIUS}', formatNumber(AOE_RANGES[heroLevel-1]/5, 1),
            );
          break;
        case 'rounded':
          basicIsAoe = true;
          t1 += '\n'+
            literal(cmdRes.responsePassiveSplash,
                '{ATTACK}', openingAttack,
            ) + '\n'+
            literal(cmdRes.responsePassiveSplashCircle,
                '{AOE RADIUS}', formatNumber(troops.basic.damage_range, 1),
            );
          break;
        case 'rectangular':
          basicIsAoe = true;
          t1 += '\n'+
            literal(cmdRes.responsePassiveSplash,
                '{ATTACK}', openingAttack,
            ) + '\n'+
            literal(cmdRes.responsePassiveSplashRect,
                '{AOE W}',
                formatNumber(Number(troops.basic.damage_range[0]), 1),
                '{AOE L}',
                formatNumber(Number(troops.basic.damage_range[1]), 1),
            );
          break;
        case 'puncture':
        default:
          basicIsAoe = true;
      }

      if (heroLevel >= 11) {
        if (basicIsAoe) {
          t2 += '\n' + literal(cmdRes.responseAwakenedDoubleSplash,
              '{ATTACK}', openingAttack,
              '{MULTIPLIER}', formatNumber(multiplier, 2));
          t3 += '\n' + literal(cmdRes.responseAwakenedLegendarySplash,
              '{ATTACK}', attack,
              '{MULTIPLIER}', formatNumber(multiplier, 2));
        } else {
          const multiplier2 = (1 + damageIncrease) * aoeRatio;
          t2 += '\n' + literal(cmdRes.responseAwakenedDoubleSplash,
              '{ATTACK}', openingAttack,
              '{MULTIPLIER}', formatNumber(multiplier2, 2));
        }

        embed.addField(h1, t1).addField(h2, t2).addField(h3, t3);
      } else {
        embed.addField(h1, t1);
      }
    } else { // attack_type == 'ranged'
      if (heroLevel >= 11) {
        embed.addField(h1, t1).addField(h2, t2).addField(h3, t3);
      } else {
        embed.addField(h1, t1);
      }
    }
    sendMessage(msg.channel, {embeds: [embed]}, msg.author.id);
  },
};
