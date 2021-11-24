'use strict';

const {diceRoll, pause, wait} = require('./common');

/** RiNG Master */
class Master {
  /**
   * @param {Member} fireStarter user who initiates the game
   * @param {TextChannel} channel
   * @param {object} gameSettings game settings
   * @param {object} l10n Localization object
   */
  constructor(fireStarter, channel, gameSettings, l10n) {
    this.fireStarter = fireStarter;
    this.players = [];
    this.channel = channel;
    this.days = 0;
    this.gameSummary = [];
    this.gameLog = '';
    this.l10n = l10n;
    this.gameSettings = gameSettings;
  }

  /** @param {string} text */
  log(text) {
    try {
      console.log(text);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @param {Interaction} i
   * @return {PLayer}
   */
  addPlayer(i) {
    const newPlayer = new Player(this, i);
    this.players.push(newPlayer);
    return newPlayer;
  }

  /** Start a day */
  startDay() {
    let scenario;
    this.days++;
    this.players.forEach((p)=>p.scenario = undefined);

    if (this.players.length >= this.gameSettings.SPECIAL_TRIGGER) {
      const DUEL_IDX = diceRoll(this.l10n.duelScenarios.length + 2);
      if (DUEL_IDX < this.l10n.duelScenarios.length) {
        const AIdx = diceRoll(this.players.length);
        let BIdx = diceRoll(this.players.length);
        if (AIdx == BIdx) BIdx = diceRoll(this.players.length);
        if (AIdx !== BIdx) {
          const DUEL = this.l10n.duelScenarios[DUEL_IDX];
          scenario = new DUEL(this, this.players[AIdx], this.players[BIdx]);
          this.players[AIdx].startDay(scenario);
          this.players[BIdx].startDay(scenario);
        }
      }

      const SPECIAL_IDX = diceRoll(this.l10n.specialScenarios.length + 4);
      if (SPECIAL_IDX < this.l10n.specialScenarios.length) {
        scenario = this.l10n.specialScenarios[SPECIAL_IDX];
        const player = this.players[diceRoll(this.players.length)];
        if (player.scenario == undefined) player.startDay(scenario);
      }
    }
    for (let pIdx=0; pIdx < this.players.length; pIdx++) {
      const player = this.players[pIdx];
      if (player.scenario == undefined) {
        player.startDay(
            this.l10n.normalScenarios[diceRoll(this.l10n.normalScenarios.length)],
        );
      }
    }
    pause(this.gameSettings.RESPONSE_TIME+0.5).then(() => this.endDay());
  }

  /** End a day */
  endDay() {
    const survivors = [];
    const eliminatedNames = [];
    this.players.forEach((p) => {
      if (p.endDay()) {
        survivors.push(p);
      } else {
        eliminatedNames.push(p.playerName);
      }
    });

    let SUMMARY = literal(STRINGS.SUMMARY_HEADING, '{DAY}', this.days);
    if (eliminatedNames.length == 0) {
      SUMMARY += STRINGS.SUMMARY_NO_ELIMINATION;
    } else if (eliminatedNames.length == 1) {
      SUMMARY += literal(
          STRINGS.SUMMARY_ONE_ELIMINATION,
          '{PLAYER}', eliminatedNames[0],
      );
    } else {
      SUMMARY += literal(
          STRINGS.SUMMARY_MANY_ELIMINATIONS,
          '{COUNT}', eliminatedNames.length,
          '{PLAYERS}', eliminatedNames.join(', '),
      );
    }
    this.gameSummary.push(SUMMARY);

    this.players = survivors;

    let gameEnded = false;
    if (survivors.length == 0) {
      gameEnded = true;
      this.gameSummary.push(STRINGS.SUMMARY_NO_WINNER);
    } else if (survivors.length <= this.gameSettings.WINNER_LIMIT) {
      gameEnded = true;
      if (survivors.length == 1) {
        this.gameSummary.push(
            literal(
                STRINGS.SUMMARY_ONE_WINNER,
                '{WINNER}', `<@${survivors[0].member.id}>`,
            ),
        );
      } else {
        this.gameSummary.push(
            literal(
                STRINGS.SUMMARY_MANY_WINNERS,
                '{COUNT}', survivors.length,
                '{WINNERS}', survivors.map((p)=>`<@${p.member.id}>`).join(', '),
            ),
        );
      }

      if (this.channel.id == GLOBAL.RING_CHANNEL) {
        const role = this.channel.guild
            .roles.cache.get(GLOBAL.LORD_OF_RING_ROLE_ID);
        role.members.forEach((member)=> member.roles.remove(role));
        survivors.forEach((survivor)=> survivor.member.roles.add(role));
      }
    }

    if (gameEnded) {
      // survivors.forEach(async (p) => await p.sendLastMessage());
      wait(this.gameSettings.PAUSE_AFTER_DAY_ENDS);
      this.channel.send(this.gameSummary.join('\n\n'));
      this.gameSummary = [];
      this.players = [];
      this.l10n.specialScenarios.forEach((s)=>s.init());
      return;
    }

    if (this.gameSummary.length >= 5) {
      this.channel.send(
          this.gameSummary.join('\n\n') +
          literal(STRINGS.SUMMARY_SURVIVOR_COUNT, '{COUNT}', survivors.length),
      );
      this.gameSummary = [];
    }
    pause(this.gameSettings.PAUSE_AFTER_DAY_ENDS)
        .then(() => this.startDay());
  }
};

module.exports = Master;
