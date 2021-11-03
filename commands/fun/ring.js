// const {literal} = require('../../helpers/literal');

const GAME_CHANNELS = ['903150247142903878', '831064145637539860'];

/* eslint-disable max-len */
const RING_IMG_URL =
 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';
/* eslint-enable max-len */

// let fireStarter;

// Debug
// const PAUSE_BEFORE_GAME_START = 0.5;
// const RESPONSE_TIME = 15;
// const PAUSE_AFTER_DAY_ENDS = 1;
// const ENTRY_TIME_LIMIT = 10;
// const PLAYER_LIMIT = 30;
// const WINNER_LIMIT = -1;

// Production
const PAUSE_BEFORE_GAME_START = 1;
const RESPONSE_TIME = 25;
const PAUSE_AFTER_DAY_ENDS = 3;
const ENTRY_TIME_LIMIT = 60;
const PLAYER_LIMIT = 100;
const WINNER_LIMIT = 2;

const SPECIAL_TRIGGER = 2;

const ENTROLL_FILTER = {
  time: ENTRY_TIME_LIMIT * 1000,
  componentType: 'BUTTON',
};
const RESPONSE_FILTER = {
  max: 1,
  time: RESPONSE_TIME * 1000,
  componentType: 'BUTTON',
};
// const DUEL_RESPONSE_TIME = 18;
// const DUEL_RESPONSE_FILTER = {max: 1, time: DUEL_RESPONSE_TIME * 1000};

const BLUE = 0x3170a6; // (49, 112, 166)
const RED = 0xb83a34; // (184, 58, 52)
// const GREEN = 0x77993c; // (119, 153, 60)

const RING_MASTER_REVIVE_RATE = 0.08;

const MAX_MEDAL = 5; // maximum number of medals a player can have.

const REVIVE = {
  description: 'You used an Honor Medal to **revive** yourself.',
  color: BLUE,
};

const MASTER_REVIVE = {
  description: 'The RiNG Master has **revived** you!',
  color: BLUE,
};

const DIED = {
  description: '**You did not make it. Better luck next time.**',
  color: RED,
};

const ANNOUNCEMENT_MSG =
'A round of **Ri**diculously **N**onsensical **G**ame (RiNG) ' +
'is about to start! Are you ready?\n\n' +
'If you want to participate in it, tap the JOIN button!\n' +
`• Entry time limit: **${ENTRY_TIME_LIMIT}** seconds\n` +
`• Max **${PLAYER_LIMIT}** participants\n` +
`• Max **${WINNER_LIMIT}** winners\n\n` +
'Winners of this game will be crowned as **Lord of RiNG**!\n\n' +
'Alright! Let\'s go!';

const ANNOUNCEMENT = {
  embeds: [{
    title: 'RiNG',
    thumbnail: {url: RING_IMG_URL},
    description: ANNOUNCEMENT_MSG,
    color: BLUE,
  }],
  components: [{
    type: 1,
    components: [{
      type: 2, // button
      label: 'JOIN',
      style: 1, // Primary (blue)
      custom_id: 'lotr.join',
    }],
  }],
};

const ANNOUNCEMENT_CLOSED = {
  embeds: [{
    title: 'RiNG',
    thumbnail: {url: RING_IMG_URL},
    description: ANNOUNCEMENT_MSG,
    color: BLUE,
  }],
  components: [{
    type: 1,
    components: [{
      type: 2, label: 'JOIN', style: 1, custom_id: 'lotr.join', disabled: true,
    }],
  }],
};

const WELCOME = {
  embeds: [{
    description:
        'Welcome to the **RiNG**. ' +
        'We are still waiting for others to sign up. ' +
        'The contest will start shortly.',
    color: BLUE,
  }],
  ephemeral: true,
};

/**
 * @param {number} seconds Number of seconds
 * @return {object}
 */
function pause(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function live(msg) {
  return {result: 'live', message: msg + ' **You survived**.'};
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function die(msg) {
  return {result: 'die', message: msg + ' **You died**.'};
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function medal(msg) {
  return {result: 'medal', message: msg + ' **You got __1__ medal**.'};
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function medal2x(msg) {
  return {result: 'medal2x', message: msg + ' **You got __2__ medals**.'};
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function medal3x(msg) {
  return {result: 'medal3x', message: msg + ' **You got __3__ medals**.'};
}

/**
 * @param {number} possibilities
 * @return {integer}
 */
function diceRoll(possibilities) {
  return Math.floor(Math.random()* possibilities);
};

/*
TRAP

You saw a small trial leading to the woods. This could be a short cut.
- Take the small trial
- Stay on the main road

The road is getting roacky

There was a heavy shower, and the road became very muddy.

*/

/* eslint-disable max-len */
const SPECIAL_SCENARIOS = [
  { // lamp
    type: 'single',
    getScenario(data, player) {
      return {
        story: 'You felt tired and sat on a stone to rest. You found a lamp at your feet.',
        choices: ['Rub the lamp', 'Don\'t rub the lamp'],
      };
    },
    resolveChoice(data, choice, player) {
      if (choice == 0) {
        if (data.lampUsed) {
          data.lampUsed = false;
          return die(
              `Lo and behold, Jinn showed up. But Jinn was not happy for the lamp had already been used by **${data.lampUsedBy}**.`,
          );
        } else {
          // lamp not used
          data.lampUsed = true;
          data.lampUsedBy = player.playerName;
          switch (diceRoll(3)) {
            case 0:
              return medal(
                  'You rubbed the lamp. Poof, Jinn appeared and asked you to make a wish. You hesitantly wished for an Honor Medal. Wish granted! *Argh… should had wished for more.',
              );
            case 1:
              return medal2x(
                  'You rubbed the lamp. Lo and behold, Jinn showed up and asked you to make a wish. You wished for 2 Honor Medals. Your wish was granted! Hurrah.',
              );
            case 2:
            default:
              return medal3x(
                  'You rubbed the lamp. Jinn appeared and asked you to make a wish. You wished for 1 Honor Medal. Jinn was feeling generous and gave you *3*! Yippee!',
              );
          }
        }
      } else {
        return live(`You did not rub the lamp.`);
      }
    }, // resolveChoice
  },
  { // trapA
    type: 'single',
    getScenario(data, player) {
      if (data.trapASet) {
        return {
          story: 'You saw two piles of dead foilage that looked suspicious. You had to go through one of them.',
          choices: ['Go through left pile', 'Go through right pile'],
        };
      } else {
        return {
          story: 'You were at a winding road in deep woods. This looked like a good place to set a trap.',
          choices: ['Set a noose trap', 'Set a deadfall trap'],
        };
      }
    },
    resolveChoice(data, choice, player) {
      if (data.trapASet) { // go through trap
        if (choice == data.trapA) {
          data.trapASet = false;
          return die(
              (choice == 0)?
              `Swoosh! You were caught in a net trap set by **${data.trapABy}**.`:
              `You fell into a trap hole dug by **${data.trapABy}**.`,
          );
        } else {
          return live(
            (choice == 0)?
            'You went left and passed safely.':
            'You went right and passed safely.',
          );
        }
      } else { // setting trap
        data.trapASet = true;
        data.trapA = choice;
        data.trapABy = player.playerName;
        return live(
            (choice == 0)?`You set a noose trap.`:'You set a deadfall hole.',
        );
      }
    }, // resolveChoice
  },
  { // trigger for lamp and trapA
    type: 'single',
    getScenario(data, player) {
      return {
        story: 'The path ahead of you was overgrown with vines. You carefully threaded through the vegetation and saw something shimmering in the vines.',
        choices: ['Check it', 'Don\'t check it'],
      };
    },
    resolveChoice(data, choice, player) {
      if (data.trapASet) {
        let result;
        if (choice == 0) {
          result = live('You looked closely and found a trap wire. Oof!');
        } else {
          result = die(
              `You kept moving and tripped a trap wire set by **${data.trapABy}**.` +
              (choice == 0)?
              `Whoosh! You were caught in a noose trap.`:
              `A heavy log dropped from above and smashed you.`);
        }
        data.trapASet = false;
        data.trapA = 0;
        data.trapABy = '';
        return result;
      } else if (data.lampUsed) {
        let result;
        if (choice == 0) {
          result = die(
              `You found a lamp and rubbed it. Jinn showed up. He was not pleased for **${data.lampUsedBy}** had already rubbed the lamp.`,
          );
        } else {
          result = live('You kept moving');
        }
        data.lampUsed = false;
        data.lampUsedBy = '';
        return result;
      } else {
        if (diceRoll(3) == 0) {
          return die(
            (choice==0)?
            'You looked closely and found an Honor Medal! As you bent over to pick it up, you felt a sting. A deadly scorpian just bit you! *Wait! don\'t scorpians live in desert?* You thought. But no matter.':
            'You kept moving and set off a trap. Oof!');
        } else {
          return live(
            (choice==0)?
            'You looked closely and found a trap wire. Phew':
            'You kept moving.');
        }
      }
    },
  },
  { // trapB
    type: 'single',
    getScenario(data, player) {
      if (data.trapBSet) {
        return {
          story: 'A fallen tree blocked your way.',
          choices: ['Go over the tree', 'Go under the tree'],
        };
      } else {
        return {
          story: 'A fallen tree blocked your way. This looked like a good place to set a trap.',
          choices: ['Make a swing-log trap', 'Dig a spike-pit trap'],
        };
      }
    },
    resolveChoice(data, choice, player) {
      if (data.trapBSet) { // go through trap
        if (choice == data.trapB) {
          data.trapBSet = false;
          return die(
              (choice == 0)?
              `You went over the fallen tree. You tripped a trap set by **${data.trapBBy}** and were flung of by a swinging log.`:
              `You went under the fallen tree and fell into a spike pit dug by **${data.trapBBy}**.`,
          );
        } else {
          return live(
            (choice == 0)?
            'You went over the fallen tree.':
            'You went under the fallen tree.',
          );
        }
      } else { // setting trap
        data.trapBSet = true;
        data.trapB = choice;
        data.trapBBy = player.playerName;
        return live(
            (choice == 0)?`You set a net trap.`:'You dug a trap hole.',
        );
      }
    },
  },
  { // duel
    type: 'duel',
    setPlayers(data, A, B) {
      data.playerA = A;
      data.playerB = B;
      // fireStarter.send(`**${A.playerName}** and **${B.playerName}** started a duel.`);
      console.log(`**${A.playerName}** and **${B.playerName}** started a duel.`);
    },
    getScenario(data, player) {
      const opponentName =
        (player.id == data.playerA.id)?
        data.playerB.playerName:
        data.playerA.playerName;
      return {
        story: `You arrived at the Duel Arena. Your opponent is **${opponentName}**. You needed to choose a hero to fight.`,
        choices: ['Choose Chione', 'Choose Selene', 'Choose Aly'],
      };
    },
    resolveChoice(data, choice, player) {
      if (player.id == data.playerA.id) {
        data.playerAChoice = choice;
      } else {
        data.playerBChoice = choice;
      }
      const heroes = ['Chione', 'Selene', 'Aly'];
      // fireStarter.send(`${player.playerName} chose ${heroes[choice]}`);
      console.log(`${player.playerName} chose ${heroes[choice]}`);
      return {result: 'live', message: `You chose ${heroes[choice]}.`};
    },
    resolveDuel(data, player) {
      const heroes = ['Chione', 'Selene', 'Aly'];
      let myChoice;
      let oppChoice;
      let oppName;
      if (player.id == data.playerA.id) {
        myChoice = data.playerAChoice;
        oppChoice = data.playerBChoice;
        oppName = data.playerB.playerName;
      } else {
        myChoice = data.playerBChoice;
        oppChoice = data.playerAChoice;
        oppName = data.playerA.playerName;
      }
      if (myChoice == oppChoice) {
        return live(`You and **${oppName}** both chose ${heroes[myChoice]}. It's a draw.`);
      } else {
        if (((myChoice == 2) && (oppChoice == 0)) || (myChoice < oppChoice)) {
          return live(`You chose ${heroes[myChoice]} and **${oppName}** chose ${heroes[oppChoice]}. You won.`);
        } else {
          return die(`You chose ${heroes[myChoice]} and **${oppName}** chose ${heroes[oppChoice]}. You lost.`);
        }
      }
    },
  },
];

const SCENARIOS = [
  {
    type: 'danger',
    story: 'The road diverged in front of you. A Goblikazes was nodding off at the junction.',
    choices: [
      'Take the left road',
      'Take the right road',
    ],
    results: [
      [
        live('You took the left road.'),
        live('You chose to go left.'),
        die('You took the left road but accidentally knocked over the Goblikaze\'s pot.'),
        die('You took the left road and saw something shiny on the road. It was an Honor Medal!\n⋮\nUh-oh, you got too excited and woke up the Goblikaze. He was not pleased.'),
      ],
      [
        live('You took the "right" road.'),
        live('You chose to go right.'),
        die('You took the right road but accidentally knocked over the Goblikaze\'s pot.'),
        die('You chose to go right and saw some coins on the ground. You bent over to pick them up and accidentally knocked over the Goblikaze\'s pot.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You were at a crossroads. One path led to a dense, dark forest. Another path led to a treacherous moutain.',
    choices: [
      'Go through the forest',
      'Climb the mountain',
    ],
    results: [
      [
        die('You went through the dark forest and got lost. You wandered and wandered until you collapsed.'),
        live('You entered the forest and quickly found a shortcut. You exited the forest with ease.'),
        live('You went through the dark forest and got lost. Could this be your end?\n⋮\nGreen stumbled upon you. He took you on his shoulder and carried you out of the forest.'),
      ],
      [
        live('You made a difficult journey climbing the mountain but made it to the other side.'),
        die('You decided to climb the mountain. You were exhausted before you reached the top. You should\'ve gone through the forest.'),
        live('You went up the mountain and found a tunnel leading straight to the other side. That was easy.'),
      ],
    ],
  },
  {
    type: 'help',
    story: 'You saw an Ogre Warrior sitting on the side of the road, crying. His club was broken.',
    choices: [
      'Don\'t help',
      'Help',
    ],
    results: [
      [
        die('You walked on but tripped over the Ogre Warrior\'s broken club.'),
        live('You pretended not to see the Ogre Warrior and kept walking.'),
        live('You ignored the Ogre Warrior and kept walking. That was heartless of you.'),
      ],
      [
        live('You offered to help, but the Ogre Warrior didn\'t hear you. You moved on.'),
        die('You offered to help. The Ogre Warrior did not want help and ate you.'),
        die('You gathered a branch and a sharp-edged stone, and you made an axe. The Ogre, somewhat confused, swung the axe a bit and hit you by mistake.'),
        medal('You helped fix the club. The Ogre Warrior thanked you and gave you an Honor Medal.'),
        medal('You found a log and fashioned it into a new club. The Ogre Warrior was impressed and gifted you an Honor Medal.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: '"Fire in the hole!" You heard a loud voice and turned your head. A Goblin Tech was testing his cannon.',
    choices: [
      'Duck to the left',
      'Duck to the right',
      'Stay where you are',
    ],
    results: [
      [
        die('You ducked to the left, and the fireball missed you.\n⋮\nWait, a debris hit you.'),
        live('You dived left just in time. Phew.'),
        live('You jumped to your left just in time. That was close.'),
      ],
      [
        die('While trying to duck the cannon ball, you panicked and stumbled. Kaboom!'),
        live('You ducked to the right and narrowly evaded the fireball. Phew.'),
        live('You ran to your right but stumbled and fell. The fireball landed just a few steps in front of you. That\'s some dumb luck.'),
      ],
      [
        die('You didn\'t move. Then you looked down and saw an X mark under your feet. Oops.'),
        live('You didn\'t move and the fireball missed you. Good gracious that was gutsy.'),
        live('You didn\'t move and the fireball swished past you. What a luck!'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You heard a rustle in the woods. A Rhino Knight was charging toward you.',
    choices: [
      'Move aside',
      'Stay where you are',
    ],
    results: [
      [
        die('You moved aside to let the Knight pass.\n⋮\nYou heard another rustle. There was a second Rhino Knight!'),
        live('You did not move. The Rhino Knight saw you and stopped. That was close.'),
      ],
      [
        live('You moved aside and the Rhino Knight whisked by you.'),
        die('You did not move. The Knight tried to halt his rhino but could\'t. You were trampled over.'),
      ],
      [
        live('You moved aside to let the Rhino Knight pass.'),
        live('False alarm! The Rhino Knight turned sharply and rode away….'),
      ],
    ],
  },
  {
    type: 'help',
    story: 'You saw an Iron Guard struggling to get something off his feet. Some magnet was stuck to his boot.',
    choices: [
      'Don\'t help',
      'Help',
    ],
    results: [
      [
        die('The Iron Guard got the magnet off on his own, but the magnet flew out of his hand and hit you.'),
        live('You ignored the Iron Guard and kept walking. That was cold.'),
        live('You avoided eye contact with the Iron Guard and quickly walked past him. Cruel.'),
      ],
      [
        medal('You helped the Iron Guard to take the magnet off.\nGuess what? It was an Honor Medal. Booyah!'),
        medal('You helped the Iron Guard to take the magnet off. The Iron Guard thanked you and gave you an Honor Medal.'),
        die('You helped the Iron Guard remove the magnet.\n⋮\nOh no! It was a magnetic bomb!'),
        die('You grabbed on the magnet and pulled hard. You got it off, stumbled backwards for several steps, and fell off a cliff behind you.'),
        live('You helped the Iron Guard. That was nice of you.'),
      ],
    ],
  },
  {
    type: 'help',
    story: 'A gust of wind knocked a baby Demon off course. The Demon was stuck in a tree and asked for your help.',
    choices: [
      'Help',
      'Don\'t help',
    ],
    results: [
      [
        die('You climbed the tree to help the Demon. The branch snapped and you fell.'),
        live('You climbed the tree and freed the the Demon. The Demon thanked and hugged you.'),
        live('You tried to climb the tree but couldn\'t reach the Demon. You were about to give up when Mephisto showed up and saved his baby!'),
        medal('You climbed the tree to help the Demon. The Demon thanked you and gave you an Honor Medal.'),
        medal('You tried to climb the tree but couldn\'t reach the Demon. Mephisto flew in and saved his baby! Mephisto thanked you for trying and gifted you a medal.'),
      ],
      [
        live('You walked past the Demon and pretended not to hear the cryng call.'),
        // live('You hurriedly walked past the baby Demon. Shame on you!'),
        live('You apologized to the Demon that you couldn\'t help and hurried on.'),
        die('You ignored the the Demon and walked on. The baby Demon freed herself. She was upset that you hadn\'t helped and attacked you from behind.'),
      ],
    ],
  },
  {
    type: 'chance',
    story: 'You saw a mysterious chest in the middle of the road.',
    choices: [
      'Open the chest',
      'Don\'t open the chest',
    ],
    results: [
      [
        die('You opened the chest and found a Voodoo Doll inside. He was playing hide-and-seek and wasn\'t thrilled that you blew his cover. He stabbed you with his needle.'),
        die('You opened the chest. Wahhhh…! A Pumpkin Guard jumped out and frightened you.'),
        medal('Woohoo! You opened the chest and found an Honor Medal.'),
        medal2x('You opened the chest and found a smaller chest. You opened the smaller chest and found a tiny chest. You opened the tiny chest and found __2__ Honor Medals.'),
        live('You opened the chest but found nothing. Better luck next time.'),
      ],
      [
        live('You paused and thought about it. You decided not to open the chest.'),
        live('You decided not to take your chance. Fortune favors the cautious.'),
        die('You walked past the chest.\n\n"Boo!" A naughty Skeleton was hiding behind the chest and gave you a heart attack.'),
      ],
    ],
  },
  {
    type: 'chance',
    story: 'You saw a gold chest and a gray chest in the middle of the road.',
    choices: [
      'Open the gold chest',
      'Open the gray chest',
    ],
    results: [
      [
        medal('You opened the gold chest and found an Honor Medal. Oh yeah!'),
        medal2x('You opened the gold chest and found __2__ Honor Medals. Yay!'),
        medal3x('You opened the gold chest and found __3__ Honor Medals. Yes!'),
        die('You opened the gold chest. A Pumpkin Guard jumped out and frightend you.'),
        die('You opened the gold chest. A genetically-modified, carnivorous Cactus was resting inside.'),
        live('You opened the gold chest and found some coins.'),
      ],
      [
        live('You opened the gray chest and found a Hell Jailer who was trapped inside. The Hell Jailer thanked you and flew away.'),
        live('You opened the gray chest and found some used nakpins.'),
        live('You opened the gray chest and found nothing.'),
        die('You opened the gray chest and found a small box inside. The box was locked. You shaked the box and then put it to your ear.\n\n"Tick tock, tick tock" Oh no, it\'s a time bomb!'), // 20%
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You reached a giant wall with three tunnels.',
    choices: [
      'Choose left',
      'Choose middle',
      'Choose right',
    ],
    results: [
      [
        live('You entered the left tunnel. It was very dark inside but you eventually made it to the other side.'),
        live('You entered the left tunnel and saw the Spider Queen. The Queen just finished her meal so she let you pass.'),
        die('You chose the left tunnel. The tunnel was surprisingly wide and straight, and you quickly reached the exit.\n⋮\nThen, you felt a sting in the back. The Spider Queen had sneaked upon you!.'),
        die('You entered the left tunnel and felt your way in the dark. *Squish*. You looked down and found that you stepped on some eggs. You looked up and saw the Spider Queen starring right at you.'),
      ],
      [
        live('You took the middle tunnel. You slipped and fell into a subterranean river. You struggled against the strong current with all your might. When you resurfaced, you were out in the open. Exhausted, you climbed ashore and took a long rest.'),
        live('You chose the middle tunnel and came to Spider Queen\'s cavern. Lucky for you the Queen was sleeping. You sneaked past the Queen and came out safely.'),
        die('You entered the middle tunnel and found the Spider Queen. You slowly and quietly backed out but got caught by sticky spider webs. The Spider Queen turned and found you.'),
        die('You entered the left tunnel and felt your way in the dark. You stepped into a hole and fell right on top of a sleeping Spider Queen. The Queen woke up and was not pleased.'),
      ],
      [
        live('You entered the right tunnel and circled out from the middle tunnel. It looked like the left tunnel was the correct one.'),
        live('You entered the right tunnel and wandered into Spider Queen\'s lair. Fortunately the Queen wasn\'t home. You came out safely.'),
        die('You took the right tunnel and wandered into Spider Queen\'s lair. The Queen was sleeping so you sneaked past her.\n⋮\nOh no! Some exploding spiders sneaked on you and smoked you.'),
        die('You took the right tunnel and found a cavern where some Exploding Spiders were playing. They were excited to see you and wanted to play with you….'),
      ],
    ],
  },
  {
    type: 'chance',
    story: 'You came upon a strange place with many rock pillars. You heard loud breathing sound. You peered through the rocks and saw Cerberus sleeping. Beside one of it\'s foot was an Honor Medal.',
    choices: [
      'Take the Medal',
      'Don\'t take the Medal',
    ],
    results: [
      [
        die('You ventured to take the Honor Medal. The creature stirred and you quickly hid behind a rock pillar.\n\nAfter a long wait, you came out of hiding and saw Cerberus staring right at you.'),
        die('You ventured close to Cerberus. The creature woke up and roared at you. You found a dead branch, picked it up, and threw it away. That only made Cerberus more angry (it was no puppy, you know).'),
        medal('You ventured to take the Honor Medal. The creature stirred and you quickly hid behind a rock pillar.\n\nAfter a long wait, you came out of hiding. Cerberus was still sleeping. You took the Medal and quickly came out.'),
        medal('You ventured close to Cerberus. The creature woke up and roared at you. You found a dead branch, picked it up, and threw it away. Cerberus ran after the branch. You quickly picked up the Medal and ran for your life.'),
        live('You ventured to take the Honor Medal. The creature stirred and you quickly hid behind a rock pillar.\n\nAfter a long wait, you came out of hiding. Cerberus had moved it\'s feet and was now on top of the Medal. Well, better luck next time.'),
        live('You ventured to take the Honor Medal. The creature woke up and roared at you. You ran for your life. Lucky for you Cerberus was chained up and didn\'t come after you.'),
      ],
      [
        live('You decided not to take your chance and hurried on.'),
        live('You sneaked past the rocky formation but accidentally stepped on a dead branch. Cerberus stirred, squinted at you, and then went back to sleep.'),
        live('You cautiously sneaked past the rocky formation.'),
        die('You used rock pillars as cover and sneaked past the creature. You pushed on one of the rock pillar too hard and some rubbles fell and smashed your head.'),
        live('You used rock pillars as cover and sneaked past the creature.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You reached a river and needed to get across. There was a transport depot nearby. A Ghost Assassin and a Magic Apprentice were about to depart. You needed to choose a ride.',
    choices: [
      'Choose Ghost Assassin',
      'Choose Magic Apprentice',
    ],
    results: [
      [
        live('You got a ride from the Ghost Assassin.'),
        live('You chose the Ghost Assassin. The Assassin didn\'t see you and blinked away. Oh well you had swim across the river.'),
        die('You got a ride from the Ghost Assassin. Ugh the rascal Assassin blinked to the top of a volcano and dropped you!'),
        die('You asked the Ghost Assassin for a ride. A flash of light blinded you. When you opened your eyes, you saw that you were heading straight into a group of Goblikazes. You crashed and burned.'),
      ],
      [
        live('You got a ride from the Magic Apprentice.'),
        live('You asked the Magic Apprentice for a ride. Unfortunately her bloom broke down and you had to swim across the river.'),
        die('You got a ride from the Magic Apprentice. Oh no, the weather conditions weren\'t right. You met an air turbulence and crashed.'),
        die('The Magic Apprentice took you on a nice ride. *Clap!* A lightening struck the Apprentice.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You heard distant rumbling sound and saw dark clouds gathering above you. You saw a cave and a tall tree.',
    choices: [
      'Hide in the cave',
      'Hide under the tree',
    ],
    results: [
      [
        die('You entered the cave to hide and saw a meditating Soul Hunter. The Soul Hunter was not happy that you disrupted his routine.'),
        die('You entered the cave to hide. It started to rain heavily. You heard some rumbling sound and looked out. There was a rock slide and the cave\'s entrance was blocked!'),
        live('You took shelter in the cave. *Clap*! A lightening hit the tree and set it on fire.'),
        live('You took shelter in the cave and waited out the rain.'),
      ],
      [
        die('You took shelter under the tree. *Clap*! A lightening hit the tree and zapped you.'),
        die('You ran to the tree to take shelter and fell right into a trench. Before you could get out, heavy rain poured down and flooded the trench.'),
        live('You took shelter under the tree. It started to rain heavily. You heard some rumbling sound and looked to the cave. A rock slide just blocked the cave\'s entrance. Lucky you!'),
        live('You took shelter under the tree and waited out the rain.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You heard a swishing sound and looked up. Cyclops was practicing boulder throwing and a boulder was flying your way.',
    choices: [
      'Hide behind a tree',
      'Hide behind a rock',
    ],
    results: [
      [
        die('You hid behind a tree but accidentally stepped on a snake. Oops.'),
        die('You hid behind a tree. Bad choice! The boulder hit the tree.'),
        live('You hid behind a tree. Good choice! The boulder hit the rock.'),
        live('You hid behind a tree and the boulder swished past you.'),
      ],
      [
        die('You hid behind a rock and the boulder swished past you.\n⋮\nYou came out from hiding and saw another boulder coming your way….'),
        die('You hid behind a rock and the boulder missed you.\n⋮\nWait, some debris hit you.'),
        live('You hid behind a rock. Good choice! The boulder hit the tree.'),
        live('You hid behind a rock and the boulder swished past you.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You fell into a trap hole. You heard thumping footstep noises closing in.',
    choices: [
      'Hide',
      'Don\'t hide',
    ],
    results: [
      [
        die('You leaned against the wall and held your breadth. After the noise subsided, you came out and waited for help.\n⋮\nNo one ever came.'),
        die('You pressed yourself against the wall and held your breadth. You heard a voice saying "hmm… who dug a hole here?" Then you heard a thump and looked up. Someone had closed the trap opening with a giant rock!'),
        live('You pressed yourself against the wall and held your breadth. After the noise subsided, you came out and climbed out of the wall.'),
        live('You pressed yourself against the wall and held your breadth. "Hey buddy, what are you doing?" A voice came from above. It was a friendly Ogre Warrior. You felt silly and asked the Ogre for help.'),
      ],
      [
        live('You stood and waited. It was a friendly Stone Golem. He threw you a rope and helped you get out.'),
        live('You stood and waited. It was a friendly Meteor Golem. He threw you a rope and helped you get out.'),
        die('You stood and waited. It was a genetically-modified Ogre Warrior. He jumped into the hole and ate you.'),
        die('You stood and waited. It was a genetically-modified, carnivorous Cactus. It extended out a vine to grab you. You pleaded for mercy to no avail.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You were thirsty and found a well. You bent over to get some water but lost your footing and fell right into the well. You saw a flimsy-looking rope hanging from the top.',
    choices: [
      'Use the rope',
      'Wait for help',
    ],
    results: [
      [
        die('You used the rope to climb out.\n⋮\nJust as you started walking, a bunny jumped out from a bush and startled you. You lost your footing again and fell back into the wall — this time, head first.'),
        die('You used the rope to climb out, and the rope snapped….'),
        live('You used the rope to climb out.'),
        live('You used the rope to climb out.'),
        live('You pulled on the rope and started to climb. The rope snapped but luckily you weren\'t far from the ground. You didn\'t give up and climbed out with your bare hands.'),
      ],
      [
        live('You waited for help. A Witchcraft Totem stopped by and helped you out.'),
        live('You waited and called out for help. A squad of inquisitor was camping nearby and heard you. You were saved.'),
        live('You waited and waited, but nobody came.\n⋮\nYou sighed and tried your luck with the rope. The rope held your weight. You were worrying too much!'),
        die('You waited and called out for help. A Meteor Golem heard you and came to rescue you. Just as the Golem pulled you up, a rubble fell from him and hit you on the head. You lost your grip and fell.'),
        die('You waited and waited. Suddenly it started to rain and the well was flooded.'),
      ],
    ],
  },
  {
    type: 'danger',
    story: 'You felt tired and thirsty. A Magic Apprentice happened to be selling some mysterious potion nearby.',
    choices: [
      'Buy the potion',
      'Don\'t buy the potion',
    ],
    results: [
      [
        die('You took the potion. You had allergic reaction and exploded.'),
        live('You bought the potion and drank it. Wow, the magic potion revitalized you.'),
        live('You took the potion and felt much better.'),
      ],
      [
        live('You walked on and found a river with raspberry bushes nearby. You took a well deserved rest.'),
        live('You walked on and found the Fountain of Youth. You drank from the fountain and were rejuvenated.'),
        die('You walked on. The thirst overwelmed you. You dropped to the groud, never getting up again.'),
      ],
    ],
  },

];

/* eslint-enable max-len */

/** RiNG player */
class Player {
  /**
   * @param {RiNGMaster} master
   * @param {Interaction} i First interaction
   */
  constructor(master, i) {
    const playerName = (i.member.nickname||i.member.user.username);
    this.master = master;
    this.player = i.member;
    this.playerName = playerName;
    this.alive = true;
    this.medal = 0;
    this.interaction = i;

    this.collector = null;
    this.resolved = false;
    this.defaultChoice = 0;
    this.scenario = null;

    i.followUp(WELCOME);
    // fireStarter.send(`${playerName} has joined the RiNG.`);
    console.log(`${playerName} has joined the RiNG.`);
  }

  /**
   * Start a new day
   * @param {object} scenario
   */
  startDay(scenario) {
    this.resolved = false;
    this.scenario = scenario;

    const buttons = [];
    let choices;
    let story;
    if ((scenario.type == 'single')||(scenario.type == 'duel')) {
      const s = scenario.getScenario(this.master.data, this);
      choices = s.choices;
      story = s.story;
    } else {
      choices = scenario.choices;
      story = scenario.story;
    }
    this.defaultChoice = diceRoll(choices.length);

    for (let bi = 0; bi < choices.length; bi++) {
      buttons.push({
        type: 2, label: choices[bi],
        style: 1, custom_id: bi.toString(),
      });
    }
    const content = {
      embeds: [{
        title: `Day ${this.master.days}`,
        description: story,
        color: BLUE,
      }],
      ephemeral: true,
      components: [{type: 1, components: buttons}],
    };
    // const filter =
    //   (scenario.type == 'duel')?
    //   DUEL_RESPONSE_FILTER:
    //   RESPONSE_FILTER;
    this.interaction.followUp(content).then( (msg) => {
      this.collector = msg.createMessageComponentCollector(RESPONSE_FILTER);
      this.collector.on('collect', (i) => {
        this.interaction = i;
        i.deferUpdate();
        this.processChoice(parseInt(i.customId));
      });
      this.collector.on('end', (collected) => {
        if (!this.resolved) {
          this.processChoice(this.defaultChoice);
        }
      });
    });
  }

  /**
   * End of the new day
   * @return {Boolean}
   */
  endDay() {
    if (this.scenario.type == 'duel') {
      const result = this.scenario.resolveDuel(this.master.data, this);
      const newResponse = {embeds: [], ephemeral: true};
      if (result.result == 'die') {
        if (this.medal) {
          this.medal--;
          newResponse.embeds.push(REVIVE);
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          newResponse.embeds.push(MASTER_REVIVE);
        } else {
          this.alive = false;
          newResponse.embeds.push(DIED);
          // fireStarter.send(`${this.playerName} has died.`);
        }
      }
      newResponse.embeds.push({
        description: result.message, color: BLUE,
      });
      this.interaction.followUp(newResponse);
    }
    return this.alive;
  }

  /**
   * Live or die?
   * @param {Integer} choice
  */
  processChoice(choice) {
    this.resolved = true;
    const newResponse = {embeds: [], ephemeral: true};
    let result;

    const scenario = this.scenario;
    if (scenario.type == 'duel') {
      result = this.scenario.resolveChoice(this.master.data, choice, this);
      newResponse.embeds.push({
        description: result.message, color: BLUE,
      });
      this.interaction.followUp(newResponse);
      return;
    }

    if (scenario.type == 'single') {
      result = this.scenario.resolveChoice(this.master.data, choice, this);
    } else {
      const __result = this.scenario.results[choice];
      result = __result[diceRoll(__result.length)];
    } // end normal scenario

    newResponse.embeds.push({
      description: result.message, color: BLUE,
    });

    switch (result.result) {
      case 'medal':
        this.medal++;
        if (this.medal > MAX_MEDAL) this.medal = MAX_MEDAL;
        break;
      case 'medal2x':
        this.medal += 2;
        if (this.medal > MAX_MEDAL) this.medal = MAX_MEDAL;
        break;
      case 'medal3x':
        this.medal += 3;
        if (this.medal > MAX_MEDAL) this.medal = MAX_MEDAL;
        break;
      case 'live':
        break;
      case 'die':
        if (this.medal) {
          this.medal--;
          newResponse.embeds.push(REVIVE);
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          newResponse.embeds.push(MASTER_REVIVE);
        } else {
          this.alive = false;
          newResponse.embeds.push(DIED);
          // fireStarter.send(`${this.playerName} has died.`);
        }
        break;
    }
    this.interaction.followUp(newResponse);
  }
}

/** RiNG Master */
class RiNGMaster {
  /**
   * @param {TextChannel} channel
   */
  constructor(channel) {
    this.players = [];
    this.channel = channel;
    this.days = 0;
    this.data = {
      lampUsed: false, lampUsedBy: '',
      trapASet: false, trapA: 0, trapABy: '',
      trapBSet: false, trapB: 0, trapBBy: '',
    };
    channel
        .send(ANNOUNCEMENT)
        .then((msg)=> {
          const contestantIds = [];
          const collector = msg
              .createMessageComponentCollector(ENTROLL_FILTER);
          collector.on('collect',
              async (interaction) => {
                interaction.deferUpdate();
                if (contestantIds.includes(interaction.member.id)) return;
                this.players.push(new Player(this, interaction));
                contestantIds.push(interaction.member.id);
                if (this.players.length ==3) {
                  this.players[0].medal = 1;
                  this.players[1].medal = 1;
                  this.players[2].medal = 1;
                  /* eslint-disable max-len */
                  this.channel.send({
                    embeds: [{
                      description:
                        `**${this.players[0].playerName}**, ` +
                        `**${this.players[1].playerName}**, and ` +
                        `**${this.players[2].playerName}** ` +
                        'have taken a headstart! They each will be awarded an Honor Medal.\n\n' +
                        'We can\'t let the victory slide without competition. Smash that JOIN button like this was a Phasecast video!',
                      color: BLUE,
                    }],
                  });
                  /* eslint-enable max-len */
                }
                if (this.players.length >= PLAYER_LIMIT) collector.stop();
              },
          );
          collector.on('end', (collected) => {
            msg.edit(ANNOUNCEMENT_CLOSED);
            channel.send({
              embeds: [{
                description:
                  'The round of **RiNG** has started.\nBest of luck to our ' +
                  `**${this.players.length}** participants!`,
                color: BLUE,
              }],
            });
            pause(PAUSE_BEFORE_GAME_START).then(() => this.startDay());
          });
        });
  }

  /** Start a day */
  startDay() {
    let scenario;
    this.days++;

    this.playerAIdx = -1;
    this.playerBIdx = -1;
    if (this.players.length > SPECIAL_TRIGGER) {
      const special = diceRoll(SPECIAL_SCENARIOS.length+5);
      if (special < SPECIAL_SCENARIOS.length) {
        if (special.type == 'single') {
          this.playerAIdx = diceRoll(this.players.length);
          scenario = SPECIAL_SCENARIOS[special];
          this.players[this.playerAIdx].startDay(scenario);
        } if (special.type == 'duel') {
          const AIdx = diceRoll(this.players.length);
          const BIdx = diceRoll(this.players.length);
          if (AIdx !== BIdx) {
            this.playerAIdx = AIdx;
            this.playerBIdx = BIdx;
            scenario = SPECIAL_SCENARIOS[special];
            scenario.setPlayers(
                this.data,
                this.players[AIdx],
                this.players[BIdx],
            );
            this.players[AIdx].startDay(scenario);
            this.players[BIdx].startDay(scenario);
          }
        }
      }
    }

    for (let pi=0; pi < this.players.length; pi++) {
      if ((pi != this.playerAIdx) && (pi != this.playerBIdx)) {
        scenario = SCENARIOS[diceRoll(SCENARIOS.length)];
        this.players[pi].startDay(scenario);
      }
    }
    pause(RESPONSE_TIME+0.5).then(() => this.endDay());
  }

  /** End a day */
  endDay() {
    const survivors = [];
    const eliminated = [];
    this.players.forEach((p) => {
      if (p.endDay()) {
        survivors.push(p);
      } else {
        eliminated.push(p);
      }
    });

    let SUMMARY = '';
    if (eliminated.length > 0) {
      SUMMARY =
        eliminated.length + ' players eliminated: ' +
        eliminated.map((p)=>'<@'+p.player.id+'>').join(', ') + '\n';
    }
    SUMMARY += survivors.length + ' players remaining.';

    this.players = survivors;
    this.channel.send(
        {
          embeds: [{
            title: 'Day ' + this.days,
            description: SUMMARY,
            color: BLUE,
          }],
        },
    );

    if (survivors.length <= WINNER_LIMIT) {
      this.channel.send(
          'The RiNG round has ended! The **Lords of RiNG** are: \n' +
          survivors.map((p)=>'<@'+p.player.id+'>').join(', '),
      );
    } else if (survivors.length == 0) {
      this.channel.send(
          'The RiNG round has ended! ' +
          'Unfortunately none of our players has survived!',
      );
    } else {
      pause(PAUSE_AFTER_DAY_ENDS).then(() => this.startDay());
    }
  }
};

const lotr = {
  name: 'ring',
  async execute(cmdRes, settings, msg, args) {
    // fireStarter = msg.author;
    if (GAME_CHANNELS.includes(msg.channelId)) {
      if (msg.channelId == '903150247142903878') {
        const CB = msg.client.AOW_CB;
        CB.send(
            'A round of RiNG is starting in 20 seconds. ' +
            'Head over to <#903150247142903878> to play!',
        );
        pause(20).then(()=>{
          CB.send('Alright. Let\'s go! <#903150247142903878>');
          new RiNGMaster(msg.channel);
        });
      } else {
        new RiNGMaster(msg.channel);
      }
    }
  },
};

module.exports = lotr;
