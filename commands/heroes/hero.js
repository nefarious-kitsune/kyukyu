const res = require('../../res/res');
const {getEmbed} = require('../../helpers/getEmbed');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = {
  name: 'hero',
  getContent(cmdRes, settings, heroName) {
    const embed = getEmbed(settings, cmdRes.files[heroName]);
    embed.thumbnail = {'url': res.images.hero_icons[heroName]};
    return {embeds: [embed]};
  },
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const menuOptions = [];
    for (const [key] of Object.entries(cmdRes.files)) {
      const heroDisplayName = l10n.HERO_DISPLAY_NAMES[key];
      menuOptions.push({label: heroDisplayName, value: key});
    }
    const menu = new MessageSelectMenu()
        .setCustomId('hero.list')
        .addOptions(menuOptions);
    const row = new MessageActionRow().addComponents(menu);

    let content = {embeds: [{description: cmdRes.menuDesc}]};
    if (args.length > 0) {
      const heroName = res.findHero(settings.lang, args[0]);
      if (heroName) {
        if (cmdRes.files.hasOwnProperty(heroName)) {
          content = this.getContent(cmdRes, settings, heroName);
        };
      }
    }
    content.components = [row];
    const response = await msg.channel.send(content);
    const collector = response.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 10 * 60 * 1000,
      idle: 1 * 60 * 1000,
    });
    collector.on('collect',
        async (interaction) => {
          newContent = this.getContent(cmdRes, settings, interaction.values[0]);
          content.components = [row];
          interaction.message.edit(newContent);
          interaction.deferUpdate();
        },
    );
    collector.on('end', (collected) => {
      response.edit({embeds: response.embeds, components: []});
    });
  },
};
