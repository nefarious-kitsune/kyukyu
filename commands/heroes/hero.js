const fs = require('fs');
const res = require('../../res/res');

module.exports = {
  name: 'hero',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const hero = res.findHero(settings.lang, args[0]);
    if ((!hero) || (!cmdRes.files.hasOwnProperty(hero))) return;

    // const heroIcon = res.images.hero_icons[hero];
    const heroRes = JSON.parse(fs.readFileSync(cmdRes.files[hero], 'utf8'));

    const embeds = [];
    const buttons = [];
    let keyIdx = 0;
    for ([key, info] of Object.entries(heroRes)) {
      const embed = {
        title: info.title,
        description: info.description,
        // thumbnail: {url: heroIcon},
      };
      if (info.hasOwnProperty('image')) embed.image = {url: info.image};
      embeds.push(embed);
      buttons.push({
        type: 2, label: info.label,
        style: 2, custom_id: String(keyIdx),
      });
      keyIdx++;
    };
    const components = [{type: 1, components: buttons}];

    msg.channel.send({
      embeds: [embeds[0]],
      components: components,
    }).then((response)=> {
      const collector = response.createMessageComponentCollector({
        time: 10 * 60 * 1000,
        idle: 1 * 60 * 1000,
      });

      collector.on('collect',
          async (i) => {
            i.deferUpdate();
            response.edit({
              embeds: [embeds[parseInt(i.customId)]],
              components: [{type: 1, components: buttons}],
            });
          },
      );
      collector.on('end', (i) => {
        response.edit({embeds: response.embeds, components: []});
      });
    });
  },
};
