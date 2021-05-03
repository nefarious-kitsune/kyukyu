const fs = require('fs');
const path = require('path');
const res = require('../res/res');

/**
 * Parse command arguments
 * @param {string} name
 * @param {number} level
 * @return {object|null}
 */
function troopsStats(name, level) {
  const troopsName = res.findTroops(name);

  if (!troopsName) return null;
  if ((level > 9) || (level < 1)) return null;

  const troopsStatsPath =
      path.resolve(__dirname, '../stats/troops/', troopsName + '.json');

  try {
    fs.accessSync(troopsStatsPath, fs.constants.R_OK | fs.constants.W_OK);
    try {
      const troopsStats = JSON.parse(fs.readFileSync(troopsStatsPath));
      const result = {
        race: troopsStats.race,
        basic: {},
      };
      for (const [key, value] of Object.entries(troopsStats.basic)) {
        if (Array.isArray(value)) {
          result.basic[key] =
              (level <= value.length)?value[level-1]:value[value.length-1];
        } else {
          result.basic[key] = value;
        }
      }
      if (troopsStats.skill) {
        result['skill'] = {};
        for (const [key, value] of Object.entries(troopsStats.skill)) {
          if (Array.isArray(value)) {
            result.skill[key] =
                (level <= value.length)?value[level-1]:value[value.length-1];
          } else {
            result.skill[key] = value;
          }
        }
      }
      return result;
    } catch (err) {
      // JSON parse error
      console.error(err);
      return null;
    }
  } catch (err) {
    // file access error
    return null;
  }
}

exports.troopsStats = troopsStats;
