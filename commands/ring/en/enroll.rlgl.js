const {diceRoll} = require('../src/common');

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

const DISABLED_BUTTONS = [
  {type: 2, label: RED, style: 4, custom_id: 'R', disabled: true},
  {type: 2, label: GRN, style: 3, custom_id: 'G', disabled: true},
];

const RLGL_INITIATING = {
  content: '**Red Ball, Green Ball**!\nStarting soon.',
  components: [{type: 1, components: DISABLED_BUTTONS}],
};

const RLGL_CLOSED = {
  content: '**Red Ball, Green Ball**!\nEnded',
  components: [{type: 1, components: DISABLED_BUTTONS}],
};

let refreshCount = 0;
let refresher;
let enrollmentMessage;
let enrollmentCollector;
let countDown;

/* eslint-enable max-len */
module.exports = {
  tally(interactions, max) {
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
    return players.sort((a, b) => b.score - a.score).slice(0, max);
  },

  async announce(GAME_SETTINGS, master) {
    const ANNOUNCEMENT_MSG =
    'A round of **Ri**diculously **N**onsensical **G**ambits (RiNGs) ' +
    'is about to start! But first, let\'s test your reflex.\n\n' +
    'We will play a Qualification Round of "Red Ball, Green Ball".\n' +
    'The rules are simple:\n' +
    '• **+1** point for each green ball you collect,\n' +
    '• **-1** point for each red ball you collect,\n' +
    `• **${GAME_SETTINGS.PLAYER_LIMIT}** players with the most points ` +
    'enter the main event."';

    const ANNOUNCEMENT = {
      embeds: [{
        title: 'RiNGs',
        thumbnail: {url: RING_IMG_URL},
        description: ANNOUNCEMENT_MSG,
        color: 0x3170a6,
      }],
    };
    const channel = master.channel;
    channel.send(ANNOUNCEMENT);
    enrollmentMessage = await channel.send(RLGL_INITIATING);
  },

  start(GAME_SETTINGS, master) {
    enrollmentCollector = enrollmentMessage.createMessageComponentCollector();
    enrollmentCollector.on('collect', (i) => i.deferUpdate());
    refreshCount = 0;
    countDown = GAME_SETTINGS.ENTRY_TIME_LIMIT;
    this.refresh();
    refresher = setInterval(this.refresh, RLGL_INTERVAL * 1000);
  },

  refresh() {
    if (countDown <= 0) {
      countDown = 0;
      clearInterval(refresher);
    }
    const buttons = (refreshCount < 2)?
      RL_GL_BUTTONS[refreshCount]: // Normal buttons
      RL_GL_BUTTONS[diceRoll(RL_GL_BUTTONS.length)]; // Tricky buttons
    enrollmentMessage.edit({
      content: `**Red Ball, Green Ball**!\n${countDown}s remaining`,
      components: [{type: 1, components: buttons}],
    });

    refreshCount++;
    countDown -= RLGL_INTERVAL;
  },

  stop(GAME_SETTINGS, master) {
    clearInterval(refresher);
    enrollmentCollector.stop();
    enrollmentMessage.edit(RLGL_CLOSED);

    const players = this.tally(
        enrollmentCollector.collected,
        GAME_SETTINGS.PLAYER_LIMIT,
    );

    players.forEach((p) => master.addPlayer(p.interaction));

    master.channel.send(
        'The following players advance: ' +
        master.players.map((p) => `<@${p.member.id}>`).join(', '),
    );

    enrollmentCollector = null;
    enrollmentMessage = null;
  },
};
