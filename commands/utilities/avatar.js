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
        const member = await msg.guild.members.fetch(mention);
        // console.log(user);
        // const user = await msg.client.users.cache.get(mention);
        msg.channel.send(
            {
              'embed': {
                'title': `Avatar of ${member.nickname}`,
                'image': {
                  'url': member.user.avatarURL(),
                },
              },
            },
        );
      }
    }
  },
};
