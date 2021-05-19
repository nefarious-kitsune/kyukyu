const fs = require('fs');
const res = require('../../res/res');
const {touchEmbed} = require('../../helpers/touchEmbed');
const {sendMessage} = require('../../helpers/sendMessage');

module.exports = {
  name: 'hero',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const heroName = res.findHero(settings.lang, args[0]);
    if (heroName == false) return;
    if (cmdRes.files.hasOwnProperty(heroName)) {
      const content = JSON.parse(
          fs.readFileSync(cmdRes.files[heroName]),
      );
      touchEmbed(settings, content);
      content.embed.thumbnail = {'url': res.images.hero_icons[heroName]};
      sendMessage(msg.channel, content, msg.author.id);
    } else {
      // NO_INFO
    }
  },
};
