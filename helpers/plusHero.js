const res = require('../res/res');
const locale = res.locale;
const {troopsData} = require('./troopsData');

/**
 * Parse command arguments
 * @param {[string]} args
 * @return {object}
 */
function plusHero(args) {
  const MAX_HERO_LEVEL = 15;
  const MAX_TROOPS_LEVEL = 9;

  // if (args.length < 1) {
  //   throw new Error(
  //       `Invalid command. Argument required.`);
  // }

  let argIdx = 0;

  let heroLevel = parseInt(args[0]);
  if (Number.isNaN(heroLevel)) {
    heroLevel = MAX_HERO_LEVEL;
  } else if ((heroLevel >=1) && (heroLevel <= MAX_HERO_LEVEL)) {
    argIdx++;
  } else {
    throw new Error(
        `Invalid command. Hero level must be 1…${MAX_HERO_LEVEL}.`);
  }

  if (argIdx >= args.length) {
    throw new Error(`Invalid command. Troops not provided.`);
  }
  const troopsName = res.findTroops(args[argIdx]);
  if (!troopsName) {
    throw new Error(`Invalid command. Troops "${args[argIdx]}" not found.`);
  }
  argIdx++;

  let troopsLevel;
  if (argIdx >= args.length) {
    troopsLevel = MAX_TROOPS_LEVEL;
  } else {
    troopsLevel = parseInt(args[argIdx]);
    if (Number.isNaN(troopsLevel)) {
      troopsLevel = 9;
    } else if ((troopsLevel >=1) && (troopsLevel <= MAX_TROOPS_LEVEL)) {
      argIdx++;
    } else {
      throw new Error(
          `Invalid command. Troops level must be 1…${MAX_TROOPS_LEVEL}.`);
    }
  }

  const troopsDisplayName = locale.TROOPS_DISPLAY_NAMES[troopsName];
  const troops = troopsData(troopsName, troopsLevel);
  if (troops === null) {
    throw new Error(
        `Cannot find data for ${troopsName}.`);
  }

  return {
    heroLevel: heroLevel,
    troops: troops,
    troopsName: troopsName,
    troopsLevel: troopsLevel,
    troopsDisplayName: troopsDisplayName,
  };
}

exports.plusHero = plusHero;
