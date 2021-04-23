const {locale} = require('../../res/res');
const prefix = process.env.prefix;

const BLACKLIST = ['reload', 'status', 'say', 'behave', 'embed'];

module.exports = {
  name: 'help',
  description: locale.COMMAND_HELP_DESC,
  usage: locale.COMMAND_HELP_USAGE,
  usage_example: `building`,
  aliases: locale.COMMAND_HELP_ALIASES,
  async execute(msg, args) {
    const {commands} = msg.client;

    if (!args[0]) {
      const commandArray = [];
      commands
          .filter((cmd)=>!BLACKLIST.includes(cmd.name))
          .forEach((cmd)=>commandArray.push(prefix + cmd.name));

      return msg.channel.send(
          locale.literal(
              locale.COMMAND_HELP_HELP,
              '%PREFIX%', process.env.prefix,
              '%COMMANDS%', commandArray.join(', '),
          )
      );
    } else {
      const cmdName = args[0].toLowerCase();
      const cmd =
            commands.get(cmdName) ||
            commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(cmdName)
            );

      if (!cmd) return msg.reply(locale.COMMAND_HELP_NOT_FOUND);

      let help = `**Name:** ${cmd.name}`;
      if (cmd.aliases) {
        help += `\n**${locale.COMMAND_HELP_LABEL_ALIASES}:** ` +
          cmd.aliases.join(', ');
      }
      if (cmd.description) {
        help += `\n**${locale.COMMAND_HELP_LABEL_DESC}:** ` +
          `${cmd.description}`;
      }
      if (cmd.usage) {
        help += `\n**${locale.COMMAND_HELP_LABEL_USAGE}:** ` +
          `\`${prefix}${cmd.name} ${cmd.usage}\``;
      }
      if (cmd.usage_example) {
        help += `\n**${locale.COMMAND_HELP_LABEL_EXAMPLE}:** ` +
          `\`${prefix}${cmd.name} ${cmd.usage_example}\``;
      }
      msg.channel.send(help);
    }
  },
};
