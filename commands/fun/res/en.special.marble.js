/*
 * Special scenarios
 */

const {SCENARIO_TYPE, survived, eliminated, pending} =
  require('./en.common');

const CHOICES = ['Red Marble', 'Blue Marble'];
const COLORS = ['Red', 'Blue'];

/* eslint-disable max-len */
module.exports = { // Duel Arena
  type: SCENARIO_TYPE.PVP_DUEL,
  setPlayers(data, A, B) {
    data.playerA = A;
    data.playerB = B;
    data.playerAChoice = undefined;
    data.playerBChoice = undefined;
    console.log(`${A.playerName} and ${B.playerName} started a Marble Game.`);
  },
  getScenario(data, player) {
    if (player.id == data.playerA.id) {
      return {
        story:
            'You arrived at the Marble Arena. ' +
            `Your opponent was **${data.playerB.playerName}**.\n\n` +
            'You needed to pick a marble ball and ' +
            'your oppoent would guess what it was.' +
            'If your opponent guessed correctly, you would lose; ' +
            'otherwise, you would win.',
        choices: CHOICES,
      };
    } else {
      return {
        story:
            'You arrived at the Marble Arena. ' +
            `Your opponent is **${data.playerA.playerName}**.\n\n` +
            'Your opponent would pick a marble ball and ' +
            'you needed to guess what it was.' +
            'If you guessed correctly, you would win; ' +
            'otherwise, you would lose.',
        choices: CHOICES,
      };
    }
  },
  resolveChoice(data, choice, player) {
    if (player.id == data.playerA.id) {
      data.playerAChoice = choice;
    } else {
      data.playerBChoice = choice;
    }

    console.log(`${player.playerName} chose ${COLORS[choice]}`);

    if (choice == undefined) {
      console.log(`xxx ${player.playerName} forfeited the match. xxxx`);
      return eliminated('You forfeited the match.');
    } else {
      console.log(`${player.playerName} chose ${COLORS[choice]}`);
      return pending(`You chose ${COLORS[choice]}.`);
    }
  },
  resolveDuel(data, player) {
    let myChoice;
    let oppChoice;
    let oppName;
    let chooser = false;
    if (player.id == data.playerA.id) {
      myChoice = data.playerAChoice;
      oppChoice = data.playerBChoice;
      oppName = data.playerB.playerName;
      chooser = true; // PlayerA chooses the ball
    } else {
      myChoice = data.playerBChoice;
      oppChoice = data.playerAChoice;
      oppName = data.playerA.playerName;
    }

    if (myChoice == undefined) {
      return eliminated('You forfeited the match.');
    }

    if (myChoice == oppChoice) {
      if (chooser) {
        return eliminated(`**${oppName}** guessed correctly!`);
      } else {
        return survived('You guessed correctly!');
      }
    } else {
      if (oppChoice == undefined) {
        return survived(`**${oppName}** forfeited the match. You won.`);
      } else if (((myChoice == 2) && (oppChoice == 0)) || (myChoice < oppChoice)) {
        return survived(`You chose ${CHOICES[myChoice]} and **${oppName}** chose ${CHOICES[oppChoice]}. You won.`);
      } else {
        return eliminated(`You chose ${CHOICES[myChoice]} and **${oppName}** chose ${CHOICES[oppChoice]}. You lost.`);
      }
    }
  },
};
