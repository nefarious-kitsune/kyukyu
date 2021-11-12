module.exports = {
  name: 'say',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == 706106177439924348) &&
        (msg.channel.type == 'DM')) {
      const secretMessage = msg.content.substring('?say '.length);
      msg.client.AOW_CB.send(secretMessage);
      msg.client.secretMessage = '';
    }
  },
};

