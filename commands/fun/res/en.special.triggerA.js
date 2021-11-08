/*
 * A special scenario where a player's action
 * can have consequence on another player
 */

const {SCENARIO_TYPE, survived, eliminated} = require('./en.common');

const SCENARIO = {
  story:
    'The path ahead of you was overgrown with vines. ' +
    'You carefully threaded through the vegetation and ' +
    'saw something shimmering in the vines.',
  choices: ['Check it', 'Don\'t check it'],
};

const RANDOM_DEATH_0 = eliminated(
    'You looked closely and found an Honor Medal! ' +
    'As you bent over to pick it up, you felt a sting. ' +
    'A deadly scorpian just bit you! ' +
    '*Wait! don\'t scorpians live in desert?* You thought. But no matter.');

const RANDOM_DEATH_1 = eliminated(
    'You kept moving and set off a trap. Oof!');

const RANDOM_SURVIVAL_0 =
  survived('You looked closely and found a trap wire. Phew');

const RANDOM_SURVIVAL_1 =
  survived('You kept moving.');

module.exports = { // lamp
  type: SCENARIO_TYPE.SPECIAL,
  getScenario(data, player) {
    return SCENARIO;
  },
  resolveChoice(data, choice, player) {
    if (data.trapASet) {
      let result;
      if (choice == 0) {
        result = survived('You looked closely and found a trap wire. Oof!');
      } else {
        result = eliminated(
            'You kept moving and tripped a trap set by **' +
            data.trapABy + '**.\n\n' +
            ((choice == 0)?
            'Whoosh! You were flung in the air a noose trap.':
            'A heavy log dropped from above and smashed you.'),
        );
        data.trapASet = false;
        data.trapA = 0;
        data.trapABy = '';
      }
      return result;
    }

    if (data.lampUsed) {
      let result;
      if (choice == 0) {
        result = eliminated(
            'You found a lamp. You rubbed it and Jinn showed up. ' +
            'Oh no Jinn looked irriated ' +
            `(**${data.lampUsedBy}** had already rubbed the lamp).`,
        );
        data.lampUsed = false;
        data.lampUsedBy = '';
      } else {
        result = survived('You kept moving');
      }
      return result;
    }

    // Lamp hasn't been used.
    // TrapA hasn't been set
    // 1/3 chance of death by RNG!
    if (diceRoll(3) == 0) {
      return eliminated((choice==0)?RANDOM_DEATH_0:RANDOM_DEATH_1);
    } else {
      return survived((choice==0)?RANDOM_SURVIVAL_0:RANDOM_SURVIVAL_1);
    }
  }, // resolveChoice
};
