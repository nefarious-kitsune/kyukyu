
module.exports = {
  name: 'clear',
  cooldowns: {},
  async execute(cmdRes, settings, msg, args) {
    if (msg.channel.type == 'DM') {
      const COOLDOWN = 30000; // 30s cooldown
      if (this.cooldowns[msg.author.id]) {
        if (this.cooldowns[msg.author.id] > Date.now()) {
          return;
        }
      }
      this.cooldowns[msg.author.id] = Date.now() + COOLDOWN;

      msg.channel.messages.fetch({limit: 100})
          .then( (messages) =>
            messages.filter((m) => m.author.id === msg.client.user.id),
          )
          .then( (messages) =>
            messages.forEach((m) => {
              try {
                m.delete();
              } catch (e) {
                // do nothing
              }
            }),
          )
          .then( msg.react('✅') );
    }
  },
};
