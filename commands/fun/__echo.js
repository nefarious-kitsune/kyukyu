const GLOBAL = require('../../global');

module.exports = {
  name: 'echo',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == GLOBAL.USER_KITSUNE_ID) &&
        (msg.channel.type == 'DM')) {
      msg.client.secretMessage = msg.content.substring('?echo '.length);
    }
  },
};

