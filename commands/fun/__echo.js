module.exports = {
  name: 'echo',
  async execute(cmdRes, settings, msg, args) {
    if ((msg.author.id == '706106177439924348') &&
        (msg.channel.type == 'DM')) {
      msg.client.secretMessage = msg.content.substring('?echo '.length);
    }
  },
};

