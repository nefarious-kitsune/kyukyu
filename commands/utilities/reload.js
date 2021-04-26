const {locale} = require('../../res/res');
const fs = require('fs');

module.exports = {
  name: 'reload',
  description: locale.COMMAND_RELOAD_DESC,
  args: true,
  async execute(msg, args) {
    const cmdName = args[0].toLowerCase();
    const cmd =
      msg.client.commands.get(cmdName) ||
      msg.client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(cmdName)
      );

    if (!cmd) {
      return msg.reply(
          literal(COMMAND_RELOAD_NOT_FOUND, '{1}', cmdName)
      );
    }

    const folderName =
        fs.readdirSync('./commands').find(
            (folder) => {
              return fs.readdirSync(`./commands/${folder}`)
                  .includes(`${cmdName}.js`);
            }
        );

    delete require.cache[require.resolve(`../${folderName}/${cmd.name}.js`)];

    try {
      const newCmd = require(`../${folderName}/${cmd.name}.js`);
      msg.client.commands.set(newCmd.name, newCmd);
      await msg.react('✅');
    } catch (error) {
      console.error(error);
      await msg.react('❌');
    }
  },
};
