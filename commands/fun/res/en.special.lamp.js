/*
 * A special scenario where a player's action
 * can have consequence on another player
 */

const {
  SCENARIO_TYPE, diceRoll,
  survived, eliminated,
  medalX1, medalX2, medalX3,
} = require('./en.common');

const UNUSED_LAMP_RESOLUTIONS = [
  medalX1(
      'You rubbed the lamp. Poof, Jinn appeared and asked you to make ' +
      'a wish. You hesitantly wished for an Honor Medal. Wish granted! ' +
      'Argh… should had wished for more.'),
  medalX2(
      'You rubbed the lamp. Lo and behold, Jinn showed up and asked you ' +
      'to make a wish. You wished for two Honor Medals. ' +
      'Your wish was granted! Hurrah.'),
  medalX3(
      'You rubbed the lamp. Jinn appeared and asked you to make a wish. ' +
      'You wished for one Honor Medal. ' +
      'Jinn was feeling generous and gave you THREE! Yippee!'),
];

const SCENARIO = {
  story:
    'You felt tired and sat on a stone to rest.' +
    'You found a lamp at your feet.',
  choices: ['Rub the lamp', 'Don\'t rub the lamp'],
};

module.exports = { // lamp
  type: SCENARIO_TYPE.SPECIAL,
  getScenario(data, player) {
    return SCENARIO;
  },
  resolveChoice(data, choice, player) {
    if (choice == 0) {
      if (data.lampUsed) {
        data.lampUsed = false;
        return eliminated(
            'You rubbed the lamp. Lo and behold, Jinn showed up. ' +
            'But Jinn was grumpy for **' +
            data.lampUsedBy + '** had alraedy rubbed the lamp.');
      } else {
        data.lampUsed = true;
        data.lampUsedBy = player.playerName;
        return UNUSED_LAMP_RESOLUTIONS[diceRoll(3)];
      }
    } else {
      return survived(`You did not rub the lamp.`);
    }
  }, // resolveChoice
};
