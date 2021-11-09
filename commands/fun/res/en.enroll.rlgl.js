const {wait, diceRoll} = require('./en.common');

/* eslint-disable max-len */
const RING_IMG_URL = 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';

const RED = 'RED';
const GRN = 'GREEN';
const RL_GL_BUTTONS = [
  [{type: 2, label: RED, style: 4, custom_id: 'R1'}, {type: 2, label: GRN, style: 3, custom_id: 'G2'}], // RR GG
  [{type: 2, label: GRN, style: 3, custom_id: 'G1'}, {type: 2, label: RED, style: 4, custom_id: 'R2'}], // GG RR

  [{type: 2, label: RED, style: 3, custom_id: 'R1'}, {type: 2, label: GRN, style: 3, custom_id: 'G2'}], // RG GG
  [{type: 2, label: GRN, style: 4, custom_id: 'G1'}, {type: 2, label: GRN, style: 3, custom_id: 'G2'}], // GR GG
  [{type: 2, label: GRN, style: 3, custom_id: 'G1'}, {type: 2, label: GRN, style: 3, custom_id: 'G2'}], // GG GG

  [{type: 2, label: RED, style: 4, custom_id: 'R1'}, {type: 2, label: GRN, style: 4, custom_id: 'G2'}], // RR GR
  [{type: 2, label: RED, style: 3, custom_id: 'R1'}, {type: 2, label: GRN, style: 4, custom_id: 'G2'}], // RG GR
  [{type: 2, label: GRN, style: 4, custom_id: 'G1'}, {type: 2, label: GRN, style: 4, custom_id: 'G2'}], // GR GR
  [{type: 2, label: GRN, style: 3, custom_id: 'G1'}, {type: 2, label: GRN, style: 4, custom_id: 'G2'}], // GG GR

  [{type: 2, label: RED, style: 4, custom_id: 'R1'}, {type: 2, label: RED, style: 3, custom_id: 'R2'}], // RR RG
  [{type: 2, label: RED, style: 3, custom_id: 'R1'}, {type: 2, label: RED, style: 3, custom_id: 'R2'}], // RG RG
  [{type: 2, label: GRN, style: 4, custom_id: 'G1'}, {type: 2, label: RED, style: 3, custom_id: 'R2'}], // GR RG
  [{type: 2, label: GRN, style: 3, custom_id: 'G1'}, {type: 2, label: RED, style: 3, custom_id: 'R2'}], // GG RG

  [{type: 2, label: RED, style: 4, custom_id: 'R1'}, {type: 2, label: RED, style: 4, custom_id: 'R2'}], // RR RR
  [{type: 2, label: RED, style: 3, custom_id: 'R1'}, {type: 2, label: RED, style: 4, custom_id: 'R2'}], // RG RR
  [{type: 2, label: GRN, style: 4, custom_id: 'G1'}, {type: 2, label: RED, style: 4, custom_id: 'R2'}], // GR RRR
];

const RLGL_INTERVAL = 3;
const RLGL_TIME = 60;
let refreshCount = 0;
let refresher;

const INIT_BUTTONS = [
  {type: 2, label: RED, style: 4, custom_id: 'R', disabled: true},
  {type: 2, label: GRN, style: 3, custom_id: 'G', disabled: true},
];

const RLGL_INITIATING = {
  content: '**Red Ball, Green Ball**!\nStarting soon.',
  components: [{type: 1, components: INIT_BUTTONS}],
};

const RLGL_CLOSED = {
  content: '**Red Ball, Green Ball**!\nEnded',
  components: [{type: 1, components: INIT_BUTTONS}],
};

/**
 * @param {Interaction[]} interactions
 * @param {Number[]} max Max number of players
 * @return {Array}
 */
function tally(interactions, max) {
  const players = [];
  interactions.forEach((i) => {
    green = i.customId.startsWith('G');
    const player = players.find((p) => (i.member.id == p.id));
    if (player) {
      player.interaction = i;
      if (green) player.score++;
      else player.score--;
    } else {
      players.push({
        id: i.member.id,
        interaction: i,
        score: (green)?1:-1,
      });
    }
  });
  return players
      .sort((a, b) => b.score - a.score)
      .slice(0, max);
}
// 114.71

/* eslint-enable max-len */
module.exports = {
  async enroll(GAME_SETTINGS, master) {
    const ANNOUNCEMENT_MSG =
    'A round of **Ri**diculously **N**onsensical **G**ambits (RiNGs) ' +
    'is about to start! But first, let\'s test your reflex.\n\n' +
    'We will play a Qualification Round of "Red Ball, Green Ball".\n' +
    'The rules are simple:\n' +
    '• **+1** point for each green ball you collect,\n' +
    '• **-1** point for each red ball you collect,\n' +
    `• **${GAME_SETTINGS.PLAYER_LIMIT}** players with most points ` +
    'enter the next round."';

    const ANNOUNCEMENT = {
      embeds: [{
        title: 'RiNGs',
        thumbnail: {url: RING_IMG_URL},
        description: ANNOUNCEMENT_MSG,
        color: 0x3170a6,
      }],
    };

    master.channel.send(ANNOUNCEMENT);
    // const redBucket = [];
    // const greenBucket = [];
    const interactions = [];
    wait(3);
    const iMessage = await master.channel.send(RLGL_INITIATING);
    const collector = iMessage.createMessageComponentCollector({
      // time: GAME_SETTINGS.ENTRY_TIME_LIMIT * 1000,
      time: (RLGL_TIME + RLGL_INTERVAL) * 1000,
      componentType: 'BUTTON',
    });
    collector.on('collect', (i) => {
      i.deferUpdate();
      interactions.push(i);
    });
    collector.on('end', (collected) => {
      clearInterval(refresher);
      refreshCount = 0;
      iMessage.edit(RLGL_CLOSED);
      const players = tally(interactions, GAME_SETTINGS.PLAYER_LIMIT);
      players.forEach((p) => master.addPlayer(p.interaction));
      master.channel.send(
          'The following players advance: ' +
          master.players.map((p) => `<@${p.player.id}>`).join(', '),
      );
      wait(GAME_SETTINGS.PAUSE_AFTER_DAY_ENDS);
      master.startDay();
    });
    refreshCount = 0;
    refresher = setInterval(() => {
      const buttons =
        (refreshCount < 2)?
        RL_GL_BUTTONS[refreshCount]:
        RL_GL_BUTTONS[diceRoll(RL_GL_BUTTONS.length)];
      iMessage.edit({
        content: '**Red Ball, Green Ball**!\n' +
            (RLGL_TIME - (RLGL_INTERVAL * refreshCount)) + 's remaining',
        components: [{type: 1, components: buttons}],
      });
      refreshCount++;
    },
    RLGL_INTERVAL * 1000);
  },
};
