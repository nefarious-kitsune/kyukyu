const fs = require('fs');

module.exports = {
  name: 'formation',
  description: 'Information about army formation',
  usage: 'basic|leveling',
  args: true,
  async execute(msg, args) {
    const cmdName = args[0].toLowerCase();
    const jsonFiles = fs.readdirSync(__dirname)
        .filter((file) => file.endsWith('.json'));
    if (jsonFiles.includes(`${cmdName}.json`)) {
      msg.channel.send(
          JSON.parse(fs.readFileSync(`${__dirname}/${cmdName}.json`))
      );
    } else {
      msg.reply(`I have no information for "${cmdName}"`);
      return;
    }
  },
};
