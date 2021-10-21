const {literal} = require('../../helpers/literal');
const {sendMessage} = require('../../helpers/sendMessage');
const {getEmbed} = require('../../helpers/getEmbed');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = {
  name: 'info',
  getItem(items, keyword) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].aliases.includes(keyword)) {
        return items[i];
      }
    }
    return false;
  },
  getContent(cmdRes, settings, keyword) {
    const item = this.getItem(cmdRes.items, keyword);
    if (!item) return false;

    const embeds = [];
    item.files.forEach( (fPath) => {
      embeds.push(getEmbed(settings, fPath));
    });
    const content = {embeds: embeds, components: []};
    if (item.related) {
      const menuOptions = [];

      item.related.forEach((kw) => {
        related = this.getItem(cmdRes.items, kw);
        if (related) {
          menuOptions.push(
              {
                label: related.aliases[0],
                description: related.desc,
                value: related.aliases[0],
              },
          );
        } else {
          console.error(`Related info not found: "${kw}"`);
        }
      });
      const menu = new MessageSelectMenu()
          .setCustomId('info.list')
          .setPlaceholder('Related')
          .addOptions(menuOptions);
      content.components = [new MessageActionRow().addComponents(menu)];
    }
    return content;
  },
  async execute(cmdRes, settings, msg, args) {
    if (args.length == 0) {
      let text = literal(cmdRes.response, '{PREFIX}', settings.prefix);
      for (let i = 0; i < cmdRes.items.length; i++) {
        text +=`**${cmdRes.items[i].aliases[0]}**: ${cmdRes.items[i].desc}\n`;
      }
      sendMessage(msg.channel, text, msg.author.id);
      return;
    }
    const keyword = args[0].toLowerCase().trim();
    const content = this.getContent(cmdRes, settings, keyword);
    if (!content) return;
    const response = await msg.channel.send(content);
    const collector = response.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 10 * 60 * 1000,
      idle: 1 * 60 * 1000,
    });
    collector.on('collect',
        async (interaction) => {
          newContent = this.getContent(cmdRes, settings, interaction.values[0]);
          interaction.message.edit(newContent);
          interaction.deferUpdate();
        },
    );
    collector.on('end', (collected) => {
      response.edit({embeds: response.embeds, components: []});
    });
  },
};
