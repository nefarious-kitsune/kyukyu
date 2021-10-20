const res = require('../../res/res');
const {literal} = require('../../helpers/literal');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = {
  name: 'greet',
  interact(client) {
    client.on('interactionCreate', (interaction) => {
      if (
        (interaction.isSelectMenu()) &&
        (interaction.customId.startsWith('greet.list.'))
      ) {
        const embed = interaction.message.embeds[0];

        // const botUser =
        //     interaction.message.author.username;
        const user =
          interaction.member.nickname ||
          interaction.member.user.username;

        embed.fields = {
          name: 'Review',
          value: interaction.values[0] + ' review by **' + user + '**!',
        };
        const content = {
          embeds: [embed],
          components: [],
        };
        interaction.message.edit(content);
      }
    });
  },
  async execute(cmdRes, settings, msg, args) {
    let greeting = res.l10n[settings.lang].GREETING;

    let avatarUrl;
    let nickname;

    if (msg.channel.type == 'GUILD_TEXT') {
      const me = await msg.guild.members.fetch(msg.client.user.id);
      nickname = me.nickname || me.user.username;
      avatarUrl = me.user.avatarURL;
    } else {
      const me = msg.client.user;
      nickname = me.username;
      avatarUrl = me.avatarURL;
    }

    greeting = literal(greeting,
        '{BOT NAME}', nickname,
        '{PREFIX}', settings.prefix,
    );
    const menu = new MessageSelectMenu()
        .setCustomId('greet.list.' + settings.lang)
        .setPlaceholder('Please leave a rating')
        .addOptions([
          {label: '🟊🟊🟊🟊🟊', value: '🟊🟊🟊🟊🟊'},
          {label: '☆☆☆☆☆', value: '☆☆☆☆☆'},
          {label: '✭✭✭✭✭', value: '✭✭✭✭✭'},
        ]);

    const row = new MessageActionRow().addComponents(menu);
    msg.channel
        .send(
            {
              embeds: [{
                description: greeting,
                thumbnail: {url: avatarUrl},
              }],
              components: [row],
            },
        )
        .then((message) => {
          setTimeout(() => {
            message.edit({embeds: message.embeds, components: []});
          }, 5 * 1000);
        });
  },
};

