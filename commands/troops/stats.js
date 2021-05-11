const res = require('../../res/res');
const locale = res.locale;
const {literal} = require('../../helpers/literal');
const {troopsData} = require('../../helpers/troopsData');

const MAX_TROOPS_LEVEL = 9;

const PERCENT_ATTRS =
    ['attack_increase', 'attack_reduction',
      'attack_speed_increase', 'attack_speed_reduction',
      'movement_speed_increase', 'movement_speed_reduction',
      'life_steal_percentage', 'damage_resistance',
      'critical_rate', 'critical_damage_rate',
      'damage_reflection'];

/**
* @param {string} k
* @param {string} v
* @return {string}
*/
function formatAttribute(k, v) {
  const key = locale.COMMAND_STATS_LABELS[k];
  let value;
  if (Array.isArray(v)) {
    value = v.join(' × ');
  } else if (typeof v === 'string' || v instanceof String) {
    value = locale.COMMAND_STATS_LABELS[v];
  } else {
    if (PERCENT_ATTRS.includes(k)) {
      v = Number(v) * 100;
      value =
        v.toLocaleString('en-US', {
          minimumSignificantDigits: 2,
          maximumSignificantDigits: 3,
        }) +
        '%';
    } else {
      value = v.toString();
    }
  }
  return `${key}: **${value}**\n`;
}

module.exports = {
  name: 'stats',
  description: locale.COMMAND_STATS_DESC,
  usage: locale.COMMAND_STATS_USAGE,
  usage_example: locale.COMMAND_STATS_USAGE_EXAMPLE,
  aliases: locale.COMMAND_STATS_ALIASES,
  args: true,
  async execute(msg, args) {
    let argIdx = 0;
    const list = [];

    do {
      const troopsName = res.findTroops(args[argIdx]);
      if (!troopsName) break;
      const troopsDisplayName = locale.TROOPS_DISPLAY_NAMES[troopsName];
      argIdx++;

      let troopsLevel;
      if (argIdx >= args.length) {
        troopsLevel = MAX_TROOPS_LEVEL;
      } else {
        troopsLevel = parseInt(args[argIdx]);
        if (Number.isNaN(troopsLevel)) {
          troopsLevel = 9;
        } else if ((troopsLevel >=1) && (troopsLevel <= MAX_TROOPS_LEVEL)) {
          argIdx++;
        } else {
          break;
        }
      }

      const troops = troopsData(troopsName, troopsLevel);
      if (troops === null) break;
      list.push({
        troopsDisplayName: troopsDisplayName,
        troops: troops,
        troopsLevel: troopsLevel,
      });
    } while (argIdx < args.length);

    if (list.length == 0) {
      throw new Error('Invalid command. No troops found.');
    }

    const DM = ((list.length > 4) || (msg.channel.type == 'dm'));

    for (let i=0; i<list.length; i++) {
      let textBasic = '';
      const troops = list[i].troops;
      for (const [k, v] of Object.entries(troops.basic)) {
        textBasic += formatAttribute(k, v);
      }

      const embed = {
        'title':
          literal(
              locale.COMMAND_STATS_HEADER,
              '{TROOPS}', list[i].troopsDisplayName,
              '{LEVEL}', list[i].troopsLevel,
          ),
        'fields': [
          {
            name: locale.COMMAND_STATS_BASIC_HEADER,
            value: textBasic,
          },
        ],
      };

      if (DM && troops.skill) {
        let textSkill = '';
        for (const [k, v] of Object.entries(troops.skill)) {
          textSkill += formatAttribute(k, v);
        }
        embed.fields.push({
          name: locale.COMMAND_STATS_SKILL_HEADER,
          value: textSkill,
        });
      }

      if (DM) {
        msg.author.send({embed: embed});
      } else {
        msg.channel.send({embed: embed});
      }
    }

    if (DM && (msg.channel.type != 'dm')) {
      msg.channel.send(locale.COMMAND_STATS_DM);
    }
  },
};
