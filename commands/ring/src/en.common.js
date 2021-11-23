const GLOBAL = require('../../../global');

// const APPEND_SURVIVED = ' **You survived.**';
const APPEND_SURVIVED = '';
const APPEND_ELIMINATED = ' **You were eliminated.**';
const APPEND_MEDAL_X1 = ' **You got 1 medal.**';
const APPEND_MEDAL_X2 = ' **You got 2 medals.**';
const APPEND_MEDAL_X3 = ' **You got 3 medals.**';

/**
 * Type of scenario
 * @enum {string}
 */
const SCENARIO_TYPE = {
  SPECIAL: 'SPECIAL',
  PVP_DUEL: 'DEUL',
  CHANCE: 'CHANCE',
  DANGER: 'DANGER',
};

/**
 * Type of scenario resolution
 * @enum {number}
 */
const RESOLUTION_TYPE = {
  ELIMINATED: 0,
  SURVIVED: 1, // Player has survived
  PENDING: 2, // Player's status is pending (i.e. result of a duel match)
  REVIVED: 10, // Player died but was then revived
  MEDAL_X1: 21,
  MEDAL_X2: 22,
  MEDAL_X3: 23,
};

/* eslint-disable max-len */
const STRINGS = {
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
};
/* eslint-enable max-len */

/**
 * @typedef RESOLUTION
 * @type {object}
 * @property {RESOLUTION_TYPE} type
 * @property {string} message
 */

/**
 * @typedef NORMAL_SCENARIO
 * @type {object}
 * @property {SCENARIO_TYPE} type
 * @property {string} story
 * @property {string[]} choices
 * @property {RESOLUTION[]} results
 */

/**
 * @param {string} msg Message
 * @return {RESOLUTION}
 */
function survived(msg) {
  return {
    type: RESOLUTION_TYPE.SURVIVED,
    message: '*' + msg + APPEND_SURVIVED + '*',
  };
}

/**
 * @param {string} msg Message
 * @return {RESOLUTION}
 */
function eliminated(msg) {
  return {
    type: RESOLUTION_TYPE.ELIMINATED,
    message: '*' + msg + APPEND_ELIMINATED + '*',
  };
}

/**
 * @param {string} msg Message
 * @return {RESOLUTION}
 */
function pending(msg) {
  return {
    type: RESOLUTION_TYPE.PENDING,
    message: '*' + msg + '*',
  };
}

/**
 * @param {string} msg Message
 * @return {RESOLUTION}
 */
function medalX1(msg) {
  return {
    type: RESOLUTION_TYPE.MEDAL_X1,
    message: '*' + msg + APPEND_MEDAL_X1 + '*',
  };
}

/**
 * @param {string} msg Message
 * @return {RESOLUTION}
 */
function medalX2(msg) {
  return {
    type: RESOLUTION_TYPE.MEDAL_X2,
    message: '*' + msg + APPEND_MEDAL_X2 + '*',
  };
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function medalX3(msg) {
  return {
    type: RESOLUTION_TYPE.MEDAL_X3,
    message: '*' + msg + APPEND_MEDAL_X3 + '*',
  };
}

/**
 * @param {number} possibilities
 * @return {integer} 0-based index of the possibilities
 */
function diceRoll(possibilities) {
  return Math.floor(Math.random()* possibilities);
};

/**
 * Asynchronously pause
 * @param {number} seconds Number of seconds
 * @return {Promise}
 */
function pause(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Hard stop the process for a few seconds
 * @param {number} seconds Number of seconds
 * @return {Promise}
 */
async function wait(seconds) {
  await pause(seconds);
}

module.exports = {
  STRINGS,
  SCENARIO_TYPE,
  RESOLUTION_TYPE,
  survived, eliminated, pending,
  medalX1, medalX2, medalX3,
  diceRoll,
  wait, pause,
};
