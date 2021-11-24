
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

module.exports = {SCENARIO_TYPE, RESOLUTION_TYPE, diceRoll, wait, pause};
