
/* eslint-disable max-len */
const RING_IMG_URL = 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';
const RING_EMOJI = '<:the_one_ring:906177472490532864>';
/* eslint-enable max-len */

const JOIN = 'JOIN';

const DISABLED_BUTTONS = [{
  type: 2, label: JOIN, style: 1,
  custom_id: 'join', emoji: RING_EMOJI, disabled: true,
}];

const ENABLED_BUTTONS = [{
  type: 2, label: JOIN, style: 1,
  custom_id: 'join', emoji: RING_EMOJI,
}];

const REFRESH_INTERVAL = 3;

const WELCOME = {
  content:
    'Welcome! The game will start shortly.\n(**Do NOT close this message**)',
  ephemeral: true,
};

/** Enrollment manager */
class Enrollment {
  /**
   * Constructor
   * @param {object} GAME_SETTINGS game settings
   * @param {Master} master Ring Master
   * */
  constructor(GAME_SETTINGS, master) {
    this.reset();
    this.master = master;
    this.gameSettings = GAME_SETTINGS;
    this.headStartMsg = '';
  }

  /** Reset everything */
  reset() {
    this.master = null;
    this.gameSettings = null;
    this.refresher = null;
    this.annoucementMessage = null;
    this.enrollmentCollector = null;
    this.countDown = 0;
    this.updateBoard = null;
  }

  /** Make an annoucement */
  announce() {
    this.ANNOUNCEMENT_MSG =
    'A round of **Ri**diculously **N**onsensical **G**ambits (RiNGs) ' +
    'is about to start! If you want to participate in it, ' +
    `tap the ${JOIN} button!\n` +
    `• Max **${this.gameSettings.PLAYER_LIMIT}** participants\n` +
    `• Max **${this.gameSettings.WINNER_LIMIT}** winners\n\n` +
    'Winners of this game will be crowned as **Lord of the RiNGs**!';

    this.master.channel.send({
      embeds: [{
        title: 'RiNGs',
        thumbnail: {url: RING_IMG_URL},
        description: this.ANNOUNCEMENT_MSG,
        color: 0x3170a6,
      }],
      components: [{type: 1, components: DISABLED_BUTTONS}],
    }).then((annoucement)=> {
      this.annoucementMessage = annoucement;
      annoucement.channel.send('Starting soon.').then((startingSoon)=>{
        this.updateBoard = startingSoon;
        this.master.updateBoard = startingSoon;
      });
    });
  }

  /** Start enrolling players */
  start() {
    const contestantIds = [];

    this.enrollmentCollector =
      this.annoucementMessage.createMessageComponentCollector();

    this.enrollmentCollector.on('collect', (interaction) => {
      interaction.reply(WELCOME);

      if (contestantIds.indexOf(interaction.member.id) != -1) return;
      const newPlayer = this.master.addPlayer(interaction);
      this.master.log(`${newPlayer.playerName} has joined the RiNGs.`);

      contestantIds.push(interaction.member.id);
      if (contestantIds.length ==3) {
        this.master.players[0].medal = 1;
        this.master.players[1].medal = 1;
        this.master.players[2].medal = 1;
        this.headStartMsg =
            `**${this.master.players[0].playerName}**, ` +
            `**${this.master.players[1].playerName}**, and ` +
            `**${this.master.players[2].playerName}** ` +
            'have taken a headstart! ' +
            'They each will be awarded an Honor Medal.\n\n';
      }
      if (contestantIds.length >= this.gameSettings.PLAYER_LIMIT) {
        this.enrollmentCollector.stop();
      }
    });

    this.annoucementMessage.edit({
      embeds: [{
        title: 'RiNGs',
        thumbnail: {url: RING_IMG_URL},
        description: this.ANNOUNCEMENT_MSG,
        color: 0x3170a6,
      }],
      components: [{type: 1, components: ENABLED_BUTTONS}],
    });
    this.countDown = this.gameSettings.ENTRY_TIME_LIMIT;
    this.refresh();
    this.refresher = setInterval(
        () => this.refresh(),
        REFRESH_INTERVAL * 1000);
  }

  /** Countdown update */
  refresh() {
    if (this.countDown <= 0) {
      this.countDown = 0;
      clearInterval(this.refresher);
    }
    this.updateBoard.edit({
      content: this.headStartMsg + `${this.countDown}s remaining`,
    });
    this.countDown -= REFRESH_INTERVAL;
  }

  /** Countdown stop */
  stop() {
    clearInterval(this.refresher);
    if (!this.enrollmentCollector.ended) this.enrollmentCollector.stop();
    this.annoucementMessage.edit({
      embeds: [{
        title: 'RiNGs',
        thumbnail: {url: RING_IMG_URL},
        description: this.ANNOUNCEMENT_MSG,
        color: 0x3170a6,
      }],
    });
    this.updateBoard.edit({
      content: this.headStartMsg +
        '**RiNGs** has started! Best of luck to all of our ' +
        `**${this.master.players.length}** players.`,
    });
    this.reset();
  }
};

/* eslint-disable max-len */
module.exports = Enrollment;

