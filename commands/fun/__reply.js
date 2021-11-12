const AOW_GUILD_ID = '658594298983350293';
const AOW_CB_ID = '658969855181193238';
const AOW_MSG_LINK =
  `https://discord.com/channels/${AOW_GUILD_ID}/${AOW_CB_ID}/`;

module.exports = {
  name: 'reply',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == '706106177439924348') &&
        (msg.channel.type == 'DM')) {
      const content = msg.content.substring('?reply '.length);
      if (content.startsWith(AOW_MSG_LINK)) {
        const breakPoint = content.indexOf(' ');
        const replyId = content.substring(AOW_MSG_LINK.length, breakPoint);
        const secretMessage = content.substring(breakPoint+1);
        msg.client.AOW_CB.send({
          content: secretMessage,
          reply: {messageReference: replyId},
        });
        msg.client.secretMessage = '';
        return;
      }
    }
  },
};

