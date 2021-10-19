const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {formatNumber} = require('../../helpers/formatNumber');
const {sendMessage} = require('../../helpers/sendMessage');
const {troopsData} = require('../../helpers/troopsData');

const MAX_TROOPS_LEVEL = 10;

const PERCENT_ATTRS =
    ['attack_increase', 'attack_reduction',
      'attack_speed_increase', 'attack_speed_reduction',
      'movement_speed_increase', 'movement_speed_reduction',
      'life_steal_percentage', 'damage_resistance',
      'critical_rate', 'critical_damage_rate',
      'damage_reflection'];

module.exports = {
  name: 'stats',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    /**
    * @param {string} k
    * @param {string} v
    * @return {string}
    */
    function formatAttribute(k, v) {
      const key = cmdRes.labels[k];
      let value;
      if (Array.isArray(v)) {
        value = v.join(' × ');
      } else if (typeof v === 'string' || v instanceof String) {
        value = cmdRes.labels[v];
      } else {
        if (PERCENT_ATTRS.includes(k)) {
          value = formatNumber(v * 100, 1) + '%';
        } else {
          value = v.toString();
        }
      }
      return `${key}: **${value}**\n`;
    }

    const l10n = res.l10n[settings.lang];

    let argIdx = 0;
    const list = [];

    do {
      const troopsName = res.findTroops(settings.lang, args[argIdx]);
      if (!troopsName) break;
      const troopsDisplayName = l10n.TROOPS_DISPLAY_NAMES[troopsName];
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

      const troops = troopsData(settings.lang, troopsName, troopsLevel);
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

    const DM = ((list.length > 4) || (msg.channel.type == 'DM'));

    for (let i=0; i<list.length; i++) {
      let textBasic = '';
      const troops = list[i].troops;
      for (const [k, v] of Object.entries(troops.basic)) {
        textBasic += formatAttribute(k, v);
      }

      const embed = {
        'title':
          literal(cmdRes.header,
              '{TROOPS}', list[i].troopsDisplayName,
              '{LEVEL}', list[i].troopsLevel,
          ),
        'fields': [
          {
            name: cmdRes.basicHeader,
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
          name: cmdRes.skillHeader,
          value: textSkill,
        });
      }

      if (DM) {
        sendMessage(msg.author, {embeds: [embed]}, msg.author.id);
        // msg.author.send({embed: embed});
      } else {
        sendMessage(msg.channel, {embeds: [embed]}, msg.author.id);
      }
    }

    if (DM && (msg.channel.type != 'DM')) {
      msg.channel.send(cmdRes.sentByDM);
    }
  },
};
