const res = require('../../res/res');
const {getEmbed} = require('../../helpers/getEmbed');

module.exports = {
  name: 'hero',
  getContent(cmdRes, settings, heroName) {
    const embed = getEmbed(settings, cmdRes.files[heroName]);
    embed.thumbnail = {'url': res.images.hero_icons[heroName]};
    return embed;
  },
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    const menuOptions = [];
    for (const [key] of Object.entries(cmdRes.files)) {
      const heroDisplayName = l10n.HERO_DISPLAY_NAMES[key];
      menuOptions.push({label: heroDisplayName, value: key});
    }
    const row = {
      type: 1,
      components: [{custom_id: 'hero.list', type: 3, options: menuOptions}],
    };

    let content = {content: cmdRes.menuDesc, components: [row]};
    if (args.length > 0) {
      const heroName = res.findHero(settings.lang, args[0]);
      if (heroName) {
        if (cmdRes.files.hasOwnProperty(heroName)) {
          content = {
            embeds: [this.getContent(cmdRes, settings, heroName)],
            components: [row],
          };
        };
      }
    }

    const response = await msg.channel.send(content);
    const collector = response.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 10 * 60 * 1000,
      idle: 1 * 60 * 1000,
    });
    collector.on('collect',
        async (interaction) => {
          interaction.deferUpdate();
          interaction.message.edit({
            embeds: [this.getContent(cmdRes, settings, interaction.values[0])],
            components: [row],
          });
        },
    );
    collector.on('end', (collected) => {
      response.edit({embeds: response.embeds, components: []});
    });
  },
};
