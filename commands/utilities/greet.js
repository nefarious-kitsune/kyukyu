const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = {
  name: 'greet',
  async execute(cmdRes, settings, msg, args) {
    let avatarUrl;
    let nickname;
    if (msg.channel.type == 'GUILD_TEXT') {
      const me = await msg.guild.members.fetch(msg.client.user.id);
      nickname = me.nickname ?? me.user.username;
      avatarUrl = me.user.avatarURL;
    } else {
      const me = msg.client.user;
      nickname = me.username;
      avatarUrl = me.avatarURL;
    }

    const greeting = {
      description: literal(
          res.l10n[settings.lang].GREETING,
          '{BOT NAME}', nickname,
          '{PREFIX}', settings.prefix,
      ),
      thumbnail: {url: avatarUrl},
    };

    const components = [{
      type: 1,
      components: [{
        type: 3,
        custom_id: 'greet.list',
        placeholder: 'Please leave a rating',
        options: [
          {label: '🟊🟊🟊🟊🟊', value: '🟊🟊🟊🟊🟊'},
          {label: '☆☆☆☆☆', value: '☆☆☆☆☆'},
          {label: '✭✭✭✭✭', value: '✭✭✭✭✭'},
        ],
      }],
    }];

    msg.channel.send({
      embeds: [greeting],
      components: components,
    }).then((response) => {
      const collector = response.createMessageComponentCollector({
        time: 1 * 60 * 1000,
        idle: 1 * 60 * 1000,
      });
      const reviews = [];
      collector.on('collect', (interaction) => {
        interaction.reply({
          content: 'Thank you for the review!',
          ephemeral: true,
        });
        const user =
          interaction.member.nickname ||
          interaction.member.user.username;
        reviews.push(interaction.values[0] + ' review by **' + user + '**!');
      });
      collector.on('end', (interaction) => {
        if (reviews.length) {
          greeting.fields = [{
            name: 'Reviews',
            value: reviews.join('\n'),
          }];
        }
        const content = {
          embeds: [greeting],
          components: [],
        };

        response.edit(content);
      });
    });
  },
};

