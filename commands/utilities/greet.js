const {locale} = require('../../res/res');
const prefix = process.env.prefix;

module.exports = {
  name: 'greet',
  aliases: ['greeting'],
  async execute(msg, args) {
    let greeting = locale.GREETING;

    const me = await msg.guild.member(msg.client.user.id);
    const nickname =
      me?
      (me.nickname||me.user.username):
      msg.client.user.username;

    greeting = greeting
        .replace(/{BOT NAME}/g, nickname)
        .replace(/{PREFIX}/g, prefix);
    msg.channel.send(greeting);
  },
};
