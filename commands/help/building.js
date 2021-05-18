const fs = require('fs');
const {locale} = require('../../res/res');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'building',
  description: locale.COMMAND_BUILDING_DESC,
  aliases: locale.COMMAND_BUILDING_ALIASES,
  args: false,
  async execute(settings, msg, args) {
    const embeds = [];
    locale.COMMAND_BUILDING_FILES.forEach( (fPath) => {
      embeds.push(JSON.parse(fs.readFileSync(fPath)));
    });
    const lastEmbed = embeds[embeds.length-1];
    if (!lastEmbed.embed.hasOwnProperty('footer')) {
      lastEmbed.embed['footer'] = {text: locale.EMBED_FOOTER};
    } else {
      embed.embed.footer.text =
        literal(embed.embed.footer.text, '{PREFIX}', process.env.prefix);
    }
    embeds.forEach( (embed) => {
      sendMessage(msg.channel, embed, msg.author.id);
    });
  },
};
