const {locale} = require('../../res/res');

module.exports = {
  name: 'clear',
  description: locale.COMMAND_CLEAR_DESC,
  aliases: locale.COMMAND_CLEAR_ALIASES,
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type == 'dm') {
      msg.channel.messages.fetch({limit: 100})
          .then( (messages) =>
            messages.filter((m) => m.author.id === msg.client.user.id),
          )
          .then( (messages) =>
            messages.forEach((m) =>
              m.delete().catch(/* ignore race condition error */),
            ),
          )
          .then( msg.react('✅') );
    }
  },
};
