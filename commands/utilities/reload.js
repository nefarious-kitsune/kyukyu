const {literal} = require('../../helpers/literal');
const {safeReact} = require('../../helpers/safeReact');
const fs = require('fs');

module.exports = {
  name: 'reload',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const cmdName = args[0].toLowerCase();
    const cmd =
      msg.client.commands.get(cmdName) ||
      msg.client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(cmdName),
      );

    if (!cmd) {
      return msg.reply(
          literal(cmdRes.commandNotFound, '{TEXT}', cmdName),
      );
    }

    const folderName =
        fs.readdirSync('./commands').find(
            (folder) => {
              return fs.readdirSync(`./commands/${folder}`)
                  .includes(`${cmdName}.js`);
            },
        );

    delete require.cache[require.resolve(`../${folderName}/${cmd.name}.js`)];

    try {
      const newCmd = require(`../${folderName}/${cmd.name}.js`);
      msg.client.commands.set(newCmd.name, newCmd);
      safeReact(msg, '✅');
    } catch (error) {
      console.error(error);
      safeReact(msg, '❌');
    }
  },
};
