const fs = require('fs');

module.exports = {
  name: 'hero',
  description: 'Information about heroes',
  usage: 'aly|selene',
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
  }
};
