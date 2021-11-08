/*
 * A special scenario where a player's action
 * can have consequence on another player
 */

const {SCENARIO_TYPE, survived, eliminated} = require('./en.common');

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
  getScenario(data, player) {
    return data.trapASet?SCENARIO_TRAP_SET:SCENARIO_TRAP_NOT_SET;
  },
  resolveChoice(data, choice, player) {
    if (data.trapASet) { // go through trap
      if (choice == data.trapA) {
        data.trapASet = false;
        if (choice == 0) {
          return eliminated(
              'You went left.\n\n'+
              'Swoosh! You were flung in the air by a noose trap set by' +
              `**${data.trapABy}**.`);
        } else {
          return eliminated(
              'You went right.\n\n'+
              'Thud! You fell into a trap hole dug by ' +
              `**${data.trapABy}**.`);
        }
      } else {
        return survived(
          (choice == 0)?
          'You went left and passed safely.':
          'You went right and passed safely.',
        );
      }
    } else { // setting trap
      data.trapASet = true;
      data.trapA = choice;
      data.trapABy = player.playerName;
      return survived(
          (choice == 0)?`You set a noose trap.`:'You set a deadfall trap.',
      );
    }
  }, // resolveChoice
};
