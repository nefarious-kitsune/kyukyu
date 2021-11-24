/*
 * A special scenario where a player's action
 * can have consequence on another player
 */

const {SCENARIO_TYPE} = require('../src/common');
const {survived, eliminated} = require('./resolutions');

const SCENARIO_TRAP_SET = {
  story:
    'You saw two piles of dead foilage that looked suspicious. ' +
    'You had to go through one of them.',
  choices: ['Go through left pile', 'Go through right pile'],
};

const SCENARIO_TRAP_NOT_SET = {
  story:
    'You were at a winding road in deep woods. ' +
    'This looked like a perfect place to set a trap.',
  choices: ['Set a noose trap', 'Set a deadfall trap'],
};

module.exports = { // lamp
  type: SCENARIO_TYPE.SPECIAL,
  init() {
    this.trapSet = false;
    this.trap = 0;
    this.trapBy = '';
  },
  getScenario(player) {
    return this.trapSet?SCENARIO_TRAP_SET:SCENARIO_TRAP_NOT_SET;
  },
  resolveChoice(choice, player) {
    if (this.trapSet) { // go through trap
      if (choice == this.trap) {
        this.trapSet = false;
        if (choice == 0) {
          return eliminated(
              'You went left.\n\n'+
              'Swoosh! You were flung in the air by a noose trap set by ' +
              `**${this.trapBy}**.`);
        } else {
          return eliminated(
              'You went right.\n\n'+
              `Thud! You fell into a trap hole dug by **${this.trapBy}**.`);
        }
      } else {
        return survived(
          (choice == 0)?
          'You went left and passed safely.':
          'You went right and passed safely.',
        );
      }
    } else { // setting trap
      this.trapSet = true;
      this.trap = choice;
      this.trapBy = player.playerName;
      return pending(
          (choice == 0)?`You set a noose trap.`:'You set a deadfall trap.',
      );
    }
  }, // resolveChoice
};
