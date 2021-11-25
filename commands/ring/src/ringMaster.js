'use strict';

const {literal} = require('../../../helpers/literal');
const {diceRoll, pause, wait} = require('./common');
const Player = require('./ringPlayer');

/** RiNG Master */
class Master {
  /**
   * @param {object} gameSettings game settings
   * @param {object} l10n Localization object
   */
  constructor(gameSettings, l10n) {
    this.players = [];
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
    const randPlayer = () => {
      const L = this.players.length;
      let idx = diceRoll(L);
      let player = this.players[idx];
      while (player.scenario == undefined) {
        idx = diceRoll(L);
        player = this.players[idx];
      }
      return player;
    };

    const randPair = () => {
      const L = this.players.length;
      let idxA = diceRoll(L);
      let playerA = this.players[idx];
      while (playerA.scenario == undefined) {
        idxA = diceRoll(L);
        playerA = this.players[idxA];
      }
      let idxB = diceRoll(L);
      let playerB = this.players[idx];
      while ((playerB.scenario == undefined) || (idxB == idxA)) {
        idxB = diceRoll(L);
        playerB = this.players[idxB];
      }
      return [playerA, playerB];
    };

    this.days++;
    this.players.forEach((p)=>p.scenario = undefined);

    const duelScenarios = this.l10n.duelScenarios;
    const specialScenarios = this.l10n.specialScenarios;
    const normalScenarios = this.l10n.normalScenarios;
    let scenario;

    if (this.players.length >= this.gameSettings.specialTrigger) {
      const DUEL_IDX = diceRoll(duelScenarios.length + 2);
      if (DUEL_IDX < duelScenarios.length) {
        const [playerA, playerB] = randPair();
        scenario = new DUEL(this, playerA, playerB);
        playerA.startDay(scenario);
        playerB.startDay(scenario);
      }

      const SPECIAL_IDX = diceRoll(specialScenarios.length + 4);
      if (SPECIAL_IDX < specialScenarios.length) {
        player = randPlayer().startDay(specialScenarios[SPECIAL_IDX]);
      }
    }

    this.players.forEach((player) => {
      if (player.scenario == undefined) {
        player.startDay(normalScenarios[diceRoll(normalScenarios.length)]);
      }
    });

    pause(this.gameSettings.responseTime+0.5).then(() => this.endDay());
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

    let SUMMARY = literal(this.l10n.SUMMARY_HEADING, '{DAY}', this.days);
    if (eliminatedNames.length == 0) {
      SUMMARY += this.l10n.SUMMARY_NO_ELIMINATION;
    } else if (eliminatedNames.length == 1) {
      SUMMARY += literal(
          this.l10n.SUMMARY_ONE_ELIMINATION,
          '{PLAYER}', eliminatedNames[0],
      );
    } else {
      SUMMARY += literal(
          this.l10n.SUMMARY_MANY_ELIMINATIONS,
          '{COUNT}', eliminatedNames.length,
          '{PLAYERS}', eliminatedNames.join(', '),
      );
    }
    this.gameSummary.push(SUMMARY);

    this.players = survivors;

    let gameEnded = false;
    if (survivors.length == 0) {
      gameEnded = true;
      this.gameSummary.push(this.l10n.SUMMARY_NO_WINNER);
    } else if (survivors.length <= this.gameSettings.winnerLimit) {
      gameEnded = true;
      if (survivors.length == 1) {
        this.gameSummary.push(
            literal(
                this.l10n.SUMMARY_ONE_WINNER,
                '{ROLE ID}', this.gameSettings.roleId,
                '{WINNER}', `<@${survivors[0].member.id}>`,
            ),
        );
      } else {
        this.gameSummary.push(
            literal(
                this.l10n.SUMMARY_MANY_WINNERS,
                '{COUNT}', survivors.length,
                '{WINNERS}', survivors.map((p)=>`<@${p.member.id}>`).join(', '),
            ),
        );
      }

      const role = this.gameSettings.gameChannel.guild
          .roles.cache.get(this.gameSettings.roleId);
      role.members.forEach((member)=> member.roles.remove(role));
      survivors.forEach((survivor)=> survivor.member.roles.add(role));
    }

    if (gameEnded) {
      // survivors.forEach(async (p) => await p.sendLastMessage());
      wait(this.gameSettings.pauseBeforeDay);
      this.gameSettings.gameChannel.send(this.gameSummary.join('\n\n'));
      this.gameSummary = [];
      this.players = [];
      this.l10n.specialScenarios.forEach((s)=>s.init());
      return;
    }

    if (this.gameSummary.length >= 5) {
      this.gameSettings.fireStarter.send(
          this.gameSummary.join('\n\n') +
          literal(
              this.l10n.SUMMARY_SURVIVOR_COUNT,
              '{COUNT}',
              survivors.length,
          ),
      );
      this.gameSummary = [];
    }
    pause(this.gameSettings.pauseBeforeDay)
        .then(() => this.startDay());
  }
};

module.exports = Master;
