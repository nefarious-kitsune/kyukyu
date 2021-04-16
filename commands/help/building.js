const fs = require('fs');

module.exports = {
  name: 'building',
  description: 'Tips for building your barrack',
  async execute(msg, args) {
    const embed1 = JSON.parse(fs.readFileSync(__dirname + '/building1.json'));
    const embed2 = JSON.parse(fs.readFileSync(__dirname + '/building2.json'));
    const embed3 = JSON.parse(fs.readFileSync(__dirname + '/building3.json'));
    msg.channel.send(embed1);
    msg.channel.send(embed2);
    msg.channel.send(embed3);
  },
};
