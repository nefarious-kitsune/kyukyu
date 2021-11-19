/*
 * Special scenarios
 */

const {SCENARIO_TYPE, diceRoll, survived, eliminated, pending} =
  require('./en.common');

const CHOICES = ['Chione', 'Selene', 'Aly'];

/* eslint-disable max-len */
module.exports = { // Duel Arena
  type: SCENARIO_TYPE.PVP_DUEL,
  setPlayers(data, A, B) {
    data.reaperChoice = diceRoll(2);
    data.playerA = A;
    data.playerB = B;
    data.playerAChoice = undefined;
    data.playerBChoice = undefined;
    console.log(`**${A.playerName}** and **${B.playerName}** started a duel.`);
  },
  getScenario(data, player) {
    const opponentName =
      (player.id == data.playerA.id)?
      data.playerB.playerName:
      data.playerA.playerName;
    return {
      story: `You arrived at the Duel Arena. Your opponent was **${opponentName}**.\n\nYou needed to choose a hero to fight.`,
      choices: CHOICES,
    };
  },
  resolveChoice(data, choice, player) {
    if (player.id == data.playerA.id) {
      data.playerAChoice = choice;
    } else {
      data.playerBChoice = choice;
    }
    if (choice == undefined) {
      console.log(`${player.playerName} forfeited a duel.`);
      return eliminated('You forfeited the duel.');
    } else {
      console.log(`${player.playerName} chose ${CHOICES[choice]}`);
      return pending(`You chose ${CHOICES[choice]}.`);
    }
  },
  resolveDuel(data, player) {
    let myChoice;
    let oppChoice;
    let oppName;
    let reaperChoice;
    if (player.id == data.playerA.id) {
      myChoice = data.playerAChoice;
      oppChoice = data.playerBChoice;
      oppName = data.playerB.playerName;
      reaperChoice = (data.reaperChoice == 0);
    } else {
      myChoice = data.playerBChoice;
      oppChoice = data.playerAChoice;
      oppName = data.playerA.playerName;
      reaperChoice = (data.reaperChoice == 1);
    }

    if (myChoice == undefined) {
      return eliminated('You forfeited the deul.');
    }

    if (myChoice == oppChoice) {
      if (reaperChoice) {
        return eliminated(
            `You and **${oppName}** both chose ${CHOICES[myChoice]}. It's a draw.` +
            '\n\nOh no! The Grim Reaper appeared out of nowhere and claimed you!');
      } else {
        return survived(
            `You and **${oppName}** both chose ${CHOICES[myChoice]}. It's a draw.` +
            '\n\nOh no! The Grim Reaper appeared out of nowhere and claimed ' +
            oppNme + '!');
      }
    } else {
      if (oppChoice == undefined) {
        return survived(`**${oppName}** forfeited the deul. You won.`);
      } else if (((myChoice == 2) && (oppChoice == 0)) || (myChoice < oppChoice)) {
        return survived(`You chose ${CHOICES[myChoice]} and **${oppName}** chose ${CHOICES[oppChoice]}. You won.`);
      } else {
        return eliminated(`You chose ${CHOICES[myChoice]} and **${oppName}** chose ${CHOICES[oppChoice]}. You lost.`);
      }
    }
  },
};
