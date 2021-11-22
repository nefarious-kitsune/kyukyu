const GLOBAL = require('../../global');
const fs = require('fs');

module.exports = {
  name: 'flush-log',
  async execute(cmdRes, settings, msg, args) {
    if (!GLOBAL.SUPER_USERS.includes(msg.author.id)) return;
    fs.truncateSync('./logs/out.log', 0);
    fs.truncateSync('./logs/error.log', 0);
    msg.channel.send('Logs flushed');
  },
};
