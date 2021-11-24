/*
 * A special scenario where a player's action
 * can have consequence on another player
 */

const {SCENARIO_TYPE} = require('../src/common');
const {survived, eliminated, pending} = require('./resolutions');

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
              'You went over the fallen tree. You tripped a trap set by '+
              `**${this.trapBy}** and were flung off by a swinging log.`);
        } else {
          return eliminated(
              'You went under the fallen tree and fell into a spike pit '+
              `dug by **${this.trapBy}**.`);
        }
      } else {
        return survived(
          (choice == 0)?
          'You went over the fallen tree.':
          'You went under the fallen tree.',
        );
      }
    } else { // setting trap
      this.trapSet = true;
      this.trap = choice;
      this.trapBy = player.playerName;
      return pending(
          (choice == 0)?`You made a swing-log trap.`:'You dug a spike-pit.',
      );
    }
  }, // resolveChoice
};

