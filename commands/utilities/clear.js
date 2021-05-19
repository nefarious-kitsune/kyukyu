module.exports = {
  name: 'clear',
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
