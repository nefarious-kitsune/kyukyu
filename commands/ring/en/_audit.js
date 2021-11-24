'use strict';

const {
  // specialScenarios,
  // duelScenarios,
  normalScenarios,
} = require('./_l10n');

const {SCENARIO_TYPE, RESOLUTION_TYPE} = require('../src/common');

const percent = (a, b) => {
  return Math.floor(100* a / b).toString().padStart(3, ' ') + '%';
};

const audit = (scenario) => {
  console.log('\n"' + scenario.story.slice(0, 20).trim() + '..."');

  if (scenario.choices.length != scenario.results.length) {
    console.log('❌ Choices and results have different length');
  }

  if (scenario.type = SCENARIO_TYPE.CHANCE) {
    for (let i=0; i < scenario.results.length; i++) {
      const result = scenario.results[i];
      let MEDAL_X3 = 0;
      let MEDAL_X2 = 0;
      let MEDAL_X1 = 0;
      let SURVIVED = 0;
      let ELIMINATED = 0;
      let INVALID = 0;
      result.forEach((r)=> {
        switch (r.type) {
          case RESOLUTION_TYPE.MEDAL_X3: MEDAL_X3++; break;
          case RESOLUTION_TYPE.MEDAL_X2: MEDAL_X2++; break;
          case RESOLUTION_TYPE.MEDAL_X1: MEDAL_X1++; break;
          case RESOLUTION_TYPE.SURVIVED: SURVIVED++; break;
          case RESOLUTION_TYPE.ELIMINATED: ELIMINATED++; break;
          default: INVALID++; break;
        }
      });
      if (INVALID) {
        console.error(`results[${i}] has invalid resolution type.`);
      } else if (ELIMINATED >= (SURVIVED + MEDAL_X1 + MEDAL_X2 + MEDAL_X3)) {
        console.error(`results[${i}] has elimination rate ≥ 50%`);
      } else {
        // console.log(
        //     `results[${i}]: ` +
        //     percent(MEDAL_X3, result.length) + ' ' +
        //     percent(MEDAL_X2, result.length) + ' ' +
        //     percent(MEDAL_X1, result.length) + ' ' +
        //     percent(SURVIVED, result.length) + ' ' +
        //     percent(ELIMINATED, result.length),
        // );
      }
    }
  } else if (scenario.type = SCENARIO_TYPE.DANGER) {
    for (let i=0; i < scenario.results.length; i++) {
      const result = scenario.results[i];
      let SURVIVED = 0;
      let ELIMINATED = 0;
      let INVALID = 0;
      result.forEach((r)=> {
        switch (r.type) {
          case RESOLUTION_TYPE.SURVIVED: SURVIVED++; break;
          case RESOLUTION_TYPE.ELIMINATED: ELIMINATED++; break;
          default: INVALID++; break;
        }
      });
      if (INVALID) {
        console.error(`results[${i}] has invalid resolution type.`);
      } else if (ELIMINATED >= SURVIVED) {
        console.error(`results[${i}] has elimination rate ≥ 50%`);
      } else {
        // console.log(
        //     `results[${i}]: ${percent(ELIMINATED, result.length)}`,
        // );
      }
    }
  }
};

normalScenarios.forEach((scenario) => audit(scenario));

