const GLOBAL = require('../../global');

module.exports = {
  name: 'say',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == GLOBAL.USER_KITSUNE_ID) &&
        (msg.channel.type == 'DM')) {
      const secretMessage = msg.content.substring('?say '.length);
      msg.client.AOW_CB.send(secretMessage);
      msg.client.secretMessage = '';
    }
  },
};

