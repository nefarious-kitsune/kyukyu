/*
 * Special scenarios
 */

const {SCENARIO_TYPE} = require('../src/common');
const {survived, eliminated} = require('./resolutions');
const CHOICES = ['Red Marble', 'Blue Marble'];
const COLORS = ['Red', 'Blue'];

/* eslint-disable max-len */

/** RiNG Master */
class duel {
  /**
   * @param {object} master RiNG Master
   * @param {object} playerA RiNG Master
   * @param {object} playerB RiNG Master
   */
  constructor(master, playerA, playerB) {
    this.type = SCENARIO_TYPE.PVP_DUEL;
    this.playerA = playerA;
    this.playerB = playerB;
    this.playerAChoice = undefined;
    this.playerBChoice = undefined;
    master.log(`${playerA.playerName} and ${playerB.playerName} started a Marble Game.`);
  }

  /**
   * @param {object} player
   * @return {object}
   */
  getScenario(player) {
    if (player.member.id == this.playerA.member.id) {
      return {
        story:
             'You arrived at the Marble Arena. ' +
             `Your opponent was **${this.playerB.playerName}**.\n\n` +
             'You needed to pick a marble ball and ' +
             'your oppoent would guess what it was.' +
             'If your opponent guessed correctly, you would lose; ' +
             'otherwise, you would win.',
        choices: CHOICES,
      };
    } else {
      return {
        story:
             'You arrived at the Marble Arena. ' +
             `Your opponent is **${this.playerA.playerName}**.\n\n` +
             'Your opponent would pick a marble ball and ' +
             'you needed to guess what it was.' +
             'If you guessed correctly, you would win; ' +
             'otherwise, you would lose.',
        choices: CHOICES,
      };
    }
  }

  /**
   * @param {undefined|number} choice
   * @param {object} player
   * @return {object}
   */
  resolveChoice(choice, player) {
    if (player.member.id == this.playerA.member.id) {
      this.playerAChoice = choice;
    } else {
      this.playerBChoice = choice;
    }

    if (choice == undefined) {
      console.log(`${player.playerName} forfeited a marble game.`);
      return eliminated('You forfeited the marble game.');
    } else {
      console.log(`${player.playerName} chose ${COLORS[choice]}`);
      return pending(`You chose ${COLORS[choice]}.`);
    }
  }

  /**
   * @param {object} player
   * @return {object}
   */
  resolveDuel(player) {
    let myChoice;
    let oppChoice;
    let oppName;
    let chooser = false;
    if (player.member.id == this.playerA.member.id) {
      myChoice = this.playerAChoice;
      oppChoice = this.playerBChoice;
      oppName = this.playerB.playerName;
      chooser = true; // PlayerA chooses the ball
    } else {
      myChoice = this.playerBChoice;
      oppChoice = this.playerAChoice;
      oppName = this.playerA.playerName;
    }

    if (myChoice == undefined) {
      return eliminated('You forfeited the marble game.');
    }

    if (myChoice == oppChoice) {
      if (chooser) {
        return eliminated(`**${oppName}** guessed correctly!`);
      } else {
        return survived('You guessed correctly!');
      }
    } else {
      if (oppChoice == undefined) {
        return survived(`**${oppName}** forfeited the marble game. You won.`);
      } else if (chooser) {
        return survived(`You chose ${CHOICES[myChoice]} and **${oppName}** guessed ${CHOICES[oppChoice]}. You won.`);
      } else {
        return eliminated(`**${oppName}** chose ${CHOICES[oppChoice]} and you guessed ${CHOICES[myChoice]}. You lost.`);
      }
    }
  }
};

module.exports = duel;
