const fs = require('fs');
const res = require('../../res/res');
const {touchEmbed} = require('../../helpers/touchEmbed');
const {sendMessage} = require('../../helpers/sendMessage');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = {
  name: 'hero',
  // args: true,
  getContent(lang, heroName) {
    const cmdRes = res.getCommandRes(lang, this.name);
    const embed = JSON.parse(fs.readFileSync(cmdRes.files[heroName]));
    embed.thumbnail = {'url': res.images.hero_icons[heroName]};
    touchEmbed({lang: lang}, embed);
    const content = {embeds: [embed]};
    return content;
  },
  list(cmdRes, settings, msg) {
    const l10n = res.l10n[settings.lang];
    const menuOptions = [];
    for (const [key] of Object.entries(cmdRes.files)) {
      const heroDisplayName = l10n.HERO_DISPLAY_NAMES[key];
      menuOptions.push(
          {
            label: heroDisplayName,
            // description: cmdRes.items[i].desc,
            value: key,
          },
      );
    }
    const menu = new MessageSelectMenu()
        .setCustomId('hero.list.' + settings.lang)
        // .setPlaceholder(cmdRes.menuPlaceholder)
        .addOptions(menuOptions);

    const row = new MessageActionRow().addComponents(menu);
    msg.channel.send(
        {
          content: cmdRes.menuDesc,
          components: [row],
        },
    );
  },
  interact(client) {
    client.on('interactionCreate', async (interaction) => {
      if (
        (interaction.isSelectMenu()) &&
        (interaction.customId.startsWith('hero.list.'))
      ) {
        const lang = (interaction.customId == ('hero.list.zht'))?'zht':'en';
        content = this.getContent(lang, interaction.values[0]);
        content.components = [];
        await interaction.message.edit(content);
        // await interaction.reply(content);
      }
    });
  },
  async execute(cmdRes, settings, msg, args) {
    if (args.length == 0) {
      this.list(cmdRes, settings, msg);
    } else {
      const heroName = res.findHero(settings.lang, args[0]);
      if (heroName == false) return;
      if (cmdRes.files.hasOwnProperty(heroName)) {
        content = this.getContent(settings.lang, heroName);
        sendMessage(msg.channel, content, msg.author.id);
      }
    }
  },
};
