const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');

const ADMIN_COMMANDS = ['reload', 'greet', 'kyukyu', 'kill'];

module.exports = {
  name: 'help',
  async execute(cmdRes, settings, msg, args) {
    const prefix = settings.prefix;
    const l10n = res.l10n[settings.lang];
    const commands = l10n.commands;

    if (!args[0]) {
      const list =
          commands
              .filter((cmd)=>
                (!ADMIN_COMMANDS.includes(cmd.name))&&(!cmd.hidden),
              )
              .map((cmd)=>prefix + cmd.aliases[0])
              .join(', ');

      const help = literal(cmdRes.response,
          '{PREFIX}', prefix,
          '{COMMANDS}', list,
      );
      sendMessage(msg.channel, help, msg.author.id);
    } else {
      const foundCmdRes = res.getCommandRes(settings.lang, args[0]);

      if (!foundCmdRes) {
        msg.channel.send({
          content: cmdRes.commandNotFound,
          reply: {messageReference: msg.id},
        });
        return;
      };

      const displayName = foundCmdRes.aliases[0];
      let help = `${cmdRes.labelName}${displayName}`;
      if (foundCmdRes.aliases.length > 1) {
        help += `\n${cmdRes.labelAliases}` +
          foundCmdRes.aliases.slice(1).join(', ');
      }
      if (foundCmdRes.desc) {
        help += `\n${cmdRes.labelDesc}${foundCmdRes.desc}`;
      }
      if (foundCmdRes.usage) {
        help += `\n${cmdRes.labelUsae}` +
          `\`${prefix}${displayName} ${foundCmdRes.usage}\``;
      }
      if (foundCmdRes.usage_example) {
        help += `\n${cmdRes.labelExample}` +
          `\`${prefix}${displayName} ${foundCmdRes.usage_example}\``;
      }
      sendMessage(msg.channel, help, msg.author.id);
    }
  },
};
