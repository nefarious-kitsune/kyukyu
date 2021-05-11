const res = require('../../res/res');
const locale = res.locale;
const {literal} = require('../../helpers/literal');
const {troopsData} = require('../../helpers/troopsData');

const MAX_TROOPS_LEVEL = 9;

module.exports = {
  name: 'stats',
  // description: locale.COMMAND_STATS_DESC,
  // usage: locale.COMMAND_STATS_USAGE,
  // usage_example: locale.COMMAND_STATS_USAGE_EXAMPLE,
  // aliases: locale.COMMAND_STATS_ALIASES,
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

    for (let i=0; i<list.length; i++) {
      let textBasic = '';
      const troops = list[i].troops;
      for (const [k, v] of Object.entries(troops.basic)) {
        const key = locale.STATS[k];
        let value;
        if (Array.isArray(v)) {
          value = v.join(' × ');
        } else if (typeof v === 'string' || v instanceof String) {
          value = locale.STATS[v];
        } else {
          value = v.toString();
        }
        textBasic += `${key}: **${value}**\n`;
      } // for ([k, v])

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
      msg.channel.send({embed: embed});
    }
  },
};
