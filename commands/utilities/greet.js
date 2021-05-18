const {locale} = require('../../res/res');
const prefix = process.env.prefix;

module.exports = {
  name: 'greet',
  aliases: ['greeting'],
  async execute(cmdRes, settings, msg, args) {
    let greeting = locale.GREETING;

    let avatarUrl;
    let nickname;

    if (msg.channel.type == 'text') {
      const me = await msg.guild.member(msg.client.user.id);
      nickname = me.displayName || me.user.username;
      avatarUrl = me.user.avatarURL;
    } else {
      const me = msg.client.user;
      nickname = me.username;
      avatarUrl = me.avatarURL;
    }

    greeting = greeting
        .replace(/{BOT NAME}/g, nickname)
        .replace(/{PREFIX}/g, prefix);
    msg.channel.send({
      embed: {
        description: greeting,
        thumbnail: {url: avatarUrl},
      },
    });
  },
};
