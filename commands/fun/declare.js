const GLOBAL = require('../../global');

module.exports = {
  name: 'declare',
  async execute(cmdRes, settings, msg, args) {
    if (!args[0]) {
    } else {
      if (msg.author.id != GLOBAL.USER_KITSUNE_ID) return;
      if (args[0].startsWith('<@') && args[0].endsWith('>')) {
        let mention = args[0].slice(2, -1);
        if (mention.startsWith('!')) mention = mention.slice(1);

        const role = msg.channel.guild
            .roles.cache.get(GLOBAL.LORD_OF_RING_ROLE_ID);

        role.members.forEach((member)=> member.roles.remove(role));
        msg.guild.members
            .fetch(mention)
            .then((member) => {
              member.roles.add(role);
              msg.channel.send(`<@${mention}> is now ` +
                `<@&${GLOBAL.LORD_OF_RING_ROLE_ID}>.`);
            })
            .catch((err) => {
              throw new Error(`Cannot find user with id "${mention}"`);
            });
      }
    }
  },
};
