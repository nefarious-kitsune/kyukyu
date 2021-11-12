// const res = require('../../res/res');
// const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'avatar',
  async execute(cmdRes, settings, msg, args) {
    if (!args[0]) {
    } else {
      if (args[0].startsWith('<@') && args[0].endsWith('>')) {
        let mention = args[0].slice(2, -1);
        if (mention.startsWith('!')) {
          mention = mention.slice(1);
        }
        msg.guild.members
            .fetch(mention)
            .then((member) => {
              msg.channel.send({
                'embeds': [{
                  'title': `Avatar of ${member.displayName}`,
                  'image': {'url': member.user.avatarURL()},
                }],
              });
            })
            .catch((err) => {
              throw new Error(`Cannot find user with id "${mention}"`);
            });
      }
    }
  },
};
