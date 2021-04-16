const fs = require('fs');
const {prefix} = require('../../config.json');

const BLACKLIST = ['reload', 'status', 'say', 'behave', 'embed'];

module.exports = {
  name: 'help',
  description: 'Show help for a specified command.',
  usage: '[command name]',
  usage_example: `building`,
  aliases: ['h', 'commands'],
  async execute(msg, args) {
    const {commands} = msg.client;

    if (!args[0]) {
      const commandArray = [];
      commands
          .filter((cmd)=>!BLACKLIST.includes(cmd.name))
          .forEach((cmd)=>commandArray.push(prefix + cmd.name));

      return msg.channel.send(
          'Type ``' + prefix + 'help <command>`` ' +
          'to get more information about a specific command!\n\n' +
          '**Commands available:**\n' + commandArray.sort().join(' ,')
      );
    } else {
      const cmdName = args[0].toLowerCase();
      const cmd =
            commands.get(cmdName) ||
            commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(cmdName)
            );

      if (!cmd) return msg.reply('This command does not exist.');

      let help = `**Name:** ${cmd.name}`;
      if (cmd.aliases) {
        help += `\n**Aliases:** ${cmd.aliases.join(', ')}`;
      }
      if (cmd.description) {
        help += `\n**Description:** ${cmd.description}`;
      }
      if (cmd.usage) {
        help += `\n**Usage:** \`${prefix}${cmd.name} ${cmd.usage}\``;
      }
      if (cmd.usage_example) {
        help += `\n**Example:** \`${prefix}${cmd.name} ${cmd.usage_example}\``;
      }
      msg.channel.send(help);
    }
  },
};
