const GLOBAL = require('../../global');
const AOW_MSG_LINK =
  `https://discord.com/channels/${GLOBAL.AOW_GUILD_ID}/${GLOBAL.AOW_CB_ID}/`;

module.exports = {
  name: 'reply',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == GLOBAL.USER_KITSUNE_ID) &&
        (msg.channel.type == 'DM')) {
      const content = msg.content.substring('?reply '.length);
      if (content.startsWith(AOW_MSG_LINK)) {
        const breakPoint = content.indexOf(' ');
        const replyId = content.substring(AOW_MSG_LINK.length, breakPoint);
        const secretMessage = content.substring(breakPoint+1);
        if (secretMessage.length) {
          msg.client.AOW_CB.send({
            content: secretMessage,
            reply: {messageReference: replyId},
          });
        }
        msg.client.secretMessage = '';
        return;
      }
    }
  },
};

