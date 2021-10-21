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
      nickname = me.nickname || me.user.username;
      avatarUrl = me.user.avatarURL;
    } else {
      const me = msg.client.user;
      nickname = me.username;
      avatarUrl = me.avatarURL;
    }

    const greeting = literal(
        res.l10n[settings.lang].GREETING,
        '{BOT NAME}', nickname,
        '{PREFIX}', settings.prefix,
    );

    const content = {
      embeds: [{
        description: greeting,
        thumbnail: {url: avatarUrl},
      }],
    };

    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId('greet.list')
            .setPlaceholder('Please leave a rating')
            .addOptions([
              {label: '🟊🟊🟊🟊🟊', value: '🟊🟊🟊🟊🟊'},
              {label: '☆☆☆☆☆', value: '☆☆☆☆☆'},
              {label: '✭✭✭✭✭', value: '✭✭✭✭✭'}]),
    );

    content.components = [row];

    const response = await msg.channel.send(content);
    const collector = response.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 1 * 60 * 1000,
      idle: 1 * 60 * 1000,
    });
    collector.on('collect',
        async (interaction) => {
          // console.log('************ collected ***************');
          // console.log(interaction);
          // const embed = interaction.message.embeds[0];
          //
          // // const botUser =
          // //     interaction.message.author.username;
          // const user =
          //   interaction.member.nickname ||
          //   interaction.member.user.username;
          //
          // embed.fields = {
          //   name: 'Review',
          //   value: interaction.values[0] + ' review by **' + user + '**!',
          // };
          // const content = {
          //   embeds: [embed],
          //   components: [],
          // };
          // interaction.message.edit(content);
          interaction.deferUpdate();
        },
    );
    collector.on('end', (collected) => {
      // console.log('************ collection ended***************');
      // console.log(collected);
      // response.edit({embeds: response.embeds, components: []});
    });
  },
};

