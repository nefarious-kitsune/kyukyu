const {literal} = require('../../helpers/literal');

const EXP_POINTS = [0, 50, 150, 350, 750, 1550,
  2550, 3750, 5150, 6750, 8550,
  10550, 12750, 15150, 17750, 20550, 23550,
  26750, 30150, 33750, 37550, 41550, 45950, 50750,
  55950, 61550, 67550, 73950, 80750, 87950, 95550,
  103550, 111950, 120750, 129950, 139550, 149550,
  160050, 171050, 182550, 194550, 207050, 220050,
  233550, 247550, 262050, 277050, 292550, 308550,
  325050, 342050, 359550, 377550, 396050, 415050,
  434550, 454550, 475550, 497550, 520550, 544550,
  569550, 595550, 622550, 650550, 679550, 709550,
  740550, 772550, 805550, 839550, 874550, 910550,
  947550, 985550,
  1024550, 1064550, 1106550, 1150550, 1196550,
  1244550, 1294550, 1346550, 1400550, 1456550,
  1514550, 1574550, 1636550, 1700550, 1766550,
  1834560, 1904550, 1976550, 2050550, 2126550,
  2204550, 2284550, 2366550, 2450550, 2536550];

module.exports = {
  name: 'exp',
  args: true,
  async execute(cmdRes, settings, msg, args) {
    const currPoints = parseInt(args[0]);
    if (currPoints <= 0) return;

    let currLevel = 0;
    for (let i = 0; i < EXP_POINTS.length; i++) {
      if (EXP_POINTS[i] > currPoints) {
        currLevel = i;
        break;
      }
    }

    if (currLevel < 10) return;
    let nextLevel = currLevel + 1;

    if (args.length > 1) {
      const lvl = parseInt(args[1]);
      if (lvl && (lvl > nextLevel)) nextLevel = lvl;
    }

    const pointsToNextLevel = EXP_POINTS[nextLevel-1] - currPoints;

    const goldToNextLevel = Math.round(pointsToNextLevel / 240);
    if (goldToNextLevel > 5) {
      msg.channel.send(
          literal(cmdRes.responseNext,
              '{CURR LEVEL}', currLevel,
              '{NEXT LEVEL}', nextLevel,
              '{GOLD AMOUNT}', goldToNextLevel,
          ),
      );
    } else {
      msg.channel.send(
          literal(cmdRes.responseURClose,
              '{CURR LEVEL}', currLevel,
              '{NEXT LEVEL}', nextLevel,
          ),
      );
    }
  },
};
