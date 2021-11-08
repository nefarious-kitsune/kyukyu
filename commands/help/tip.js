const res = require('../../res/res');

module.exports = {
  name: 'tip',
  async execute(cmdRes, settings, msg, args) {
    const l10n = res.l10n[settings.lang];
    let idx = Math.floor(Math.random()*cmdRes.items.length);
    let next = (idx == (cmdRes.items.length-1))?0:(idx+1);

    const content = {
      embeds: [{
        title: cmdRes.labelTitle,
        description: cmdRes.items[idx],
        footer: {text: l10n.DISCLAIMER},
      }],
      components: [{
        type: 1,
        components: [{
          type: 2, // button
          label: cmdRes.labelNext,
          style: 2, // gray
          custom_id: 'tip.next',
        }],
      }],
    };
    response = await msg.channel.send(content);

    const collector = response.createMessageComponentCollector({
      time: 10 * 60 * 1000,
      idle: 1 * 60 * 1000,
    });
    collector.on('collect',
        async (interaction) => {
          idx = next;
          next = (idx == (cmdRes.items.length-1))?0:(idx+1);
          content.embeds[0].description = cmdRes.items[idx];
          interaction.message.edit(content);
          interaction.deferUpdate();
        },
    );
    collector.on('end', (collected) => {
      response.edit({embeds: response.embeds, components: []});
    });
  },
};

