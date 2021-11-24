// Resolution constructors

const {RESOLUTION_TYPE} = require('../src/common');

// const APPEND_SURVIVED = ' **You survived.**';
const APPEND_SURVIVED = '';
const APPEND_ELIMINATED = ' **You were eliminated.**';
const APPEND_MEDAL_X1 = ' **You got 1 medal.**';
const APPEND_MEDAL_X2 = ' **You got 2 medals.**';
const APPEND_MEDAL_X3 = ' **You got 3 medals.**';

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

/* eslint-disable max-len */
module.exports = {
  survived: survived,
  eliminated: eliminated,
  medalX1: medalX1,
  medalX2: medalX2,
  medalX3: medalX3,
  pending: pending,
};
/* eslint-enable max-len */

