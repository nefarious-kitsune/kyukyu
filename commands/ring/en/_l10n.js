const GLOBAL = require('../../../global');

const specialScenarios = [
  require('./special.lamp'),
  require('./special.trapA'),
  require('./special.triggerA'),
  require('./special.trapB'),
];

const duelScenarios = [
  require('./special.marble'),
];

const normalScenarios =
  require('./chance').concat(require('./danger'));

/* eslint-disable max-len */
module.exports = {
  PREANNOUNCEMENT: `RiNG is starting in {SECONDS} seconds. Head over to <#${GLOBAL.RING_CHANNEL}> to play!`,
  LETSGO: `Alright. Let\'s go! <#${GLOBAL.RING_CHANNEL}>`,
  SUMMARY_HEADING: '__Day {DAY}__\n',
  SUMMARY_NO_ELIMINATION: 'No player was eliminated.',
  SUMMARY_ONE_ELIMINATION: '1 player was eliminated: {PLAYER}.',
  SUMMARY_MANY_ELIMINATIONS: '{COUNT} players were eliminated: {PLAYERS}.',
  SUMMARY_NO_WINNER: 'The game has ended! Unfortunately **none of our players** has survived!',
  SUMMARY_ONE_WINNER: `The game has ended! {WINNER} is <@&${GLOBAL.LORD_OF_RING_ROLE_ID}>`,
  SUMMARY_MANY_WINNERS: `The game has ended! <@&${GLOBAL.LORD_OF_RING_ROLE_ID}> are: {WINNERS}`,
  SUMMARY_SURVIVOR_COUNT: '\n\n**{COUNT}** players remaining.',
  REVIVE_MSG: '\n\nYou were **revived** with an Honor Medal.',
  MASTER_REVIVE_MSG: '\n\nYou were **revived** by the RiNG Master!',
  DEATH_MSG: '\n\n**You did not make it. Better luck next time.**',
  specialScenarios: specialScenarios,
  duelScenarios: duelScenarios,
  normalScenarios: normalScenarios,
};
/* eslint-enable max-len */

