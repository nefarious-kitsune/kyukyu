/*
 * A special scenario where a player's action
 * can have consequence on another player
 */

const {SCENARIO_TYPE, survived, eliminated} = require('./en.common');

const SCENARIO_TRAP_SET = {
  story: 'A fallen tree blocked your way.',
  choices: ['Go over the tree', 'Go under the tree'],
};

const SCENARIO_TRAP_NOT_SET = {
  story:
    'A tree had fallen and blocked the road. ' +
    'This looked like an idea place to set a trap.',
  choices: ['Make a swing-log trap', 'Dig a spike-pit trap'],
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
              'You went over the fallen tree. You tripped a trap set by'+
              `**${data.trapABy}** and were flung of by a swinging log.`);
        } else {
          return eliminated(
              'You went under the fallen tree and fell into a spike pit '+
              `dug by **${data.trapABy}**.`);
        }
      } else {
        return survived(
          (choice == 0)?
          'You went over the fallen tree.':
          'You went under the fallen tree.',
        );
      }
    } else { // setting trap
      data.trapASet = true;
      data.trapA = choice;
      data.trapABy = player.playerName;
      return survived(
          (choice == 0)?`You made a swing-log trap.`:'You dug a spike-pit.',
      );
    }
  }, // resolveChoice
};

