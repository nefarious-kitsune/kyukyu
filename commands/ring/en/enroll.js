const {literal} = require('../../../helpers/literal');

/* eslint-disable max-len */
const RING_IMG_URL = 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';
/* eslint-enable max-len */

const REFRESH_INTERVAL = 3;

/** Enrollment manager */
class Enrollment {
  /**
   * Constructor
   * @param {object} gameSettings game settings
   * @param {Master} master Ring Master
   * */
  constructor(gameSettings, master) {
    this.reset();
    this.l10n = master.l10n.ENROLL;
    this.master = master;
    this.gameSettings = gameSettings;
    this.headStartText = '';
  }

  /** Reset everything */
  reset() {
    this.master = null;
    this.gameSettings = null;
    this.L10N = null;
    this.refresher = null;
    this.annoucementMessage = null;
    this.enrollmentCollector = null;
    this.countDown = 0;
    this.updateBoard = null;
    this.contestantIds = [];
  }

  /** Make an annoucement */
  announce() {
    this.announcementText = literal(
        this.l10n.ANNOUNCEMENT_MSG,
        '{PLAYER LIMIT}', this.gameSettings.playerLimit,
        '{WINNEr LIMIT}', this.gameSettings.winnerLimit,
        '{ROLE NAME}', this.gameSettings.roleName,
    );

    this.gameSettings.gameChannel.send({
      embeds: [{
        thumbnail: {url: RING_IMG_URL},
        description: this.announcementText,
        color: 0x3170a6,
      }],
      components: [{
        type: 1,
        components: [{
          type: 2, label: this.l10n.JOIN,
          style: 1, custom_id: 'join', disabled: true,
        }],
      }],
    }).then((annoucement)=> {
      this.annoucementMessage = annoucement;
      annoucement.channel
          .send(this.l10n.STARTING_SOON)
          .then((startingSoon)=>{
            this.updateBoard = startingSoon;
            this.master.updateBoard = startingSoon;
          });
    });
  }

  /** Start enrolling players */
  start() {
    this.enrollmentCollector =
      this.annoucementMessage.createMessageComponentCollector(
          {time: this.gameSettings.entryTimeLimit * 1000},
      );

    this.enrollmentCollector.on('collect', (i) => {
      this.onCollect(i);
    });

    this.enrollmentCollector.on('end', (i, reason) => {
      if (reason == 'time') clearInterval(this.refresher);
      this.onEnd(i);
    });

    this.annoucementMessage.edit({
      embeds: [{
        thumbnail: {url: RING_IMG_URL},
        description: this.announcementText,
        color: 0x3170a6,
      }],
      components: [{
        type: 1,
        components: [{
          type: 2, label: this.l10n.JOIN,
          style: 1, custom_id: 'join',
        }],
      }],
    });
    this.countDown = this.gameSettings.entryTimeLimit;
    this.refresh();
    this.refresher = setInterval(
        () => this.refresh(),
        REFRESH_INTERVAL * 1000);
  }

  /**
   * Process interaction
   * @param {Interaction} i Interaction
   */
  onCollect(i) {
    if (this.contestantIds.indexOf(i.member.id) != -1) {
      i.deferUpadte();
      return;
    }

    i.reply({content: this.l10n.WELCOME, ephemeral: true});
    const newPlayer = this.master.addPlayer(i);
    this.master.log(`${newPlayer.playerName} has joined the RiNGs.`);
    contestantIds.push(i.member.id);
    if (contestantIds.length ==3) {
      this.master.players[0].medal = 1;
      this.master.players[1].medal = 1;
      this.master.players[2].medal = 1;
      this.headStartText = literal(
          this.l10n.HEAD_START,
          '{PLAYER 1}', this.master.players[0].playerName,
          '{PLAYER 2}', this.master.players[1].playerName,
          '{PLAYER 3}', this.master.players[2].playerName,
      );
    }
    if (contestantIds.length >= this.gameSettings.playerLimit) {
      this.enrollmentCollector.stop();
    }
  }

  /** Countdown update */
  refresh() {
    if (this.countDown <= 0) {
      this.countDown = 0;
      clearInterval(this.refresher);
    }
    this.updateBoard.edit(
        this.headStartText +
        literal(this.l10n.TIME_REMAINING, '{SECONDS}', this.countDown),
    );
    this.countDown -= REFRESH_INTERVAL;
  }

  /** Countdown stop */
  onEnd() {
    this.annoucementMessage.edit({
      embeds: [{
        title: 'RiNGs',
        thumbnail: {url: RING_IMG_URL},
        description: this.announcementText,
        color: 0x3170a6,
      }],
    });
    this.updateBoard.edit(
        this.headStartText +
        literal(
            this.l10n.STARTED,
            '{PLAYER COUNT}', this.contestantIds.length),
    );
    this.reset();
    this.master.startDay();
  }
};

/* eslint-disable max-len */
module.exports = Enrollment;

