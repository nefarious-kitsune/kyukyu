const fs = require('fs');
const path = require('path');
const res = require('../res/res');

/**
 * Parse command arguments
 * @param {string} name
 * @param {number} level
 * @return {object|null}
 */
function troopsData(name, level) {
  const troopsName = res.findTroops(name);

  if (!troopsName) return null;
  if ((level > 9) || (level < 1)) return null;

  const troopsDataPath =
      path.resolve(__dirname, '../data/troops/', troopsName + '.json');

  try {
    fs.accessSync(troopsDataPath, fs.constants.R_OK | fs.constants.W_OK);
    try {
      const troopsData = JSON.parse(fs.readFileSync(troopsDataPath));
      const result = {
        race: troopsData.race,
        basic: {},
      };
      for (const [key, value] of Object.entries(troopsData.basic)) {
        if (Array.isArray(value)) {
          result.basic[key] =
              (level <= value.length)?value[level-1]:value[value.length-1];
        } else {
          result.basic[key] = value;
        }
      }
      if (troopsData.skill) {
        result['skill'] = {};
        for (const [key, value] of Object.entries(troopsData.skill)) {
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

exports.troopsData = troopsData;
