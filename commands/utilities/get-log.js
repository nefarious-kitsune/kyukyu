const GLOBAL = require('../../global');

module.exports = {
  name: 'get-log',
  async execute(cmdRes, settings, msg, args) {
    if (!GLOBAL.SUPER_USERS.includes(msg.author.id)) return;
    msg.author.send({
      files: [
        {attachment: './logs/out.log', name: 'out.log'},
        {attachment: './logs/error.log', name: 'error.log'},
      ],
    });
  },
};
