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
  LETSGO: 'Alright. Let\'s go! <#{CHANNEL ID}>',
  SUMMARY_HEADING: '__Day {DAY}__\n',
  SUMMARY_NO_ELIMINATION: 'No player was eliminated.',
  SUMMARY_ONE_ELIMINATION: '1 player was eliminated: {PLAYER}.',
  SUMMARY_MANY_ELIMINATIONS: '{COUNT} players were eliminated: {PLAYERS}.',
  SUMMARY_NO_WINNER: 'The game has ended! Unfortunately **none of our players** has survived!',
  SUMMARY_ONE_WINNER: 'The game has ended! {WINNER} is <@&{ROLE ID}>',
  SUMMARY_MANY_WINNERS: `The game has ended! <@&${GLOBAL.LORD_OF_RING_ROLE_ID}> are: {WINNERS}`,
  SUMMARY_SURVIVOR_COUNT: '\n\n**{COUNT}** players remaining.',
  REVIVE_MSG: '\n\nYou were **revived** with an Honor Medal.',
  MASTER_REVIVE_MSG: '\n\nYou were **revived** by the RiNG Master!',
  DEATH_MSG: '\n\n**You did not make it. Better luck next time.**',
  ENROLL: {
    JOIN: 'JOIN',
    ANNOUNCEMENT_MSG: 'A round of **Ri**diculously **N**onsensical **G**ambits (RiNGs) is about to start! If you want to participate in it, tap the JOIN button!\n• Max **{PLAYER LIMIT}** participants\n• Max **{WINNER LIMIT}** winners\n\nWinners of this game will be crowned as **{ROLE NAME}**!',
    STARTING_SOON: 'Starting soon',
    WELCOME: 'Welcome! The game will start shortly.\n(**Do NOT close this message**)',
    HEAD_START: '**{PLAYER 1}**, **{PLAYER 2}**, and **{PLAYER 3}** have taken a headstart! They each will be awarded an Honor Medal.\n\n',
    TIME_REMAINING: '{SECONDS}s remaining',
    STARTED: '**RiNGs** has started! Best of luck to all of our **{PLAYER COUNT}** players.',
  },
  specialScenarios: specialScenarios,
  duelScenarios: duelScenarios,
  normalScenarios: normalScenarios,
};
/* eslint-enable max-len */

