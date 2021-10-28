// const {literal} = require('../../helpers/literal');

// let inprocess = false;

const GAME_CHANNELS = [
  '903150247142903878',
  '831064145637539860',
];

/* eslint-disable max-len */
const RING_IMG_URL =
 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';
/* eslint-enable max-len */

const ENROLLMENT_TIME = 10;
const ENTROLL_FILTER = {time: ENROLLMENT_TIME * 1000};
// const RESPONSE_TIME = 10;
const RESPONSE_FILTER = {max: 1};

const FINISH_LINE = 10;
const STATUS_ALIVE = 0; // player is alive
const STATUS_DEAD = 1; // player is dead
const STATUS_VICOTRY = 10; // player has reached the finishing line
const BLUE = 0x3170a6; // (49, 112, 166)
const RED = 0xb83a34; // (184, 58, 52)
// const GREEN = 0x77993c; // (119, 153, 60)

const RING_MASTER_REVIVE_RATE = 0.15;

const REVIVE = {
  description:
    'You used an Honor Medal to **revive** yourself. ' +
    'You were **back to the starting line**.',
  color: BLUE,
};

const MASTER_REVIVE = {
  description:
    'The RiNG Master has **revived** you! ' +
    'You were **back to the starting line**',
  color: BLUE,
};

const VICTORIOUS = {
  description:
    'You made it to the finsh line!\n\n ' +
    'You have been crowned **Lord of the RiNG**',
  color: RED,
};

const LOST = {
  description:
    '**You did not make it to the finish line. ' +
    'Better luck next time.**',
  color: RED,
};

const ANNOUNCEMENT = {
  embeds: [{
    thumbnail: {url: RING_IMG_URL},
    description:
      'A **Ri**diculously **N**onsensical **G**ame (RiNG) ' +
      'is about to start! Are you ready?\n\n' +
      'If you want to participate in it, tap the JOIN button! ' +
      `You have ${ENROLLMENT_TIME} seconds to enter. ` +
      'Only one entry counts.\n\n' +
      'The survivors of this game will be crowned as Lord of RiNG!\n\n' +
      'Alright! Let\'s go!',
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

const START = {
  embeds: [{
    description:
        'The **RiNG** has started. The rule is simple. ' +
        'Make it to the finish line in 5 minutes and you win. Best of luck!',
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
  return {
    result: 'live',
    message: msg + ' **You lived**.',
  };
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function die(msg) {
  return {
    result: 'die',
    message: msg + ' **You died**.',
  };
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function medal(msg) {
  return {
    result: 'medal',
    message: msg + ' **You lived**.',
  };
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function win(msg) {
  return {
    result: 'win',
    message: msg + ' **You won**.',
  };
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function circle(msg) {
  return {
    result: 'circle',
    message: msg + ' **You lived**.',
  };
}

/**
 * @param {string} msg Message
 * @return {object}
 */
function restart(msg) {
  return {
    result: 'restart',
    message: msg + ' **You returned to the starting line**.',
  };
}

/**
 * @param {number} steps
 * @param {string} msg
 * @return {object}
 */
function move(steps, msg) {
  return {
    result: 'move',
    message: msg + ' **You moved ' + steps + ' spaces**.',
  };
}

/**
 * @param {number} possibilities
 * @return {integer}
 */
function diceRoll(possibilities) {
  return Math.floor(Math.random()* possibilities);
};

/* eslint-disable max-len */
const SCENARIOS = [
  {
    story: 'The road diverged in front of you. A Goblikazes was nodding off at the junction.',
    choices: [
      'Take the right road',
      'Take the left road',
    ],
    results: [
      [
        die('You took the right road but accidentally knocked over the Goblikaze\'s pot. You burnt to death.'),
        live('You took the left road.'),
      ],
      [
        live('You took the "right" road.'),
        die('You took the left road but accidentally knocked over the Goblikaze\'s pot. You burnt to death.'),
      ],
      [
        live('You took the right road.'),
        live('You took the left road.'),
      ],
    ],
  },
  {
    story: 'You saw an Ogre Warrior sitting on the side of the road, crying. His club was broken.',
    choices: [
      'Ignore and keep walking',
      'Help the Ogre Warrior',
    ],
    results: [
      [
        die('You tripped over the Ogre Warrior\'s broken club and died.'),
        live('You offered to help, but the Ogre Warrior did not hear you. You moved on.'),
      ],
      [
        live('You pretended you did not see the Ogre Warrior and kept walking.'),
        die('You offered to help. The Ogre Warrior did not want help and ate you.'),
      ],
      [
        live('You ignored the Ogre Warrior and kept walking. That was heartless of you.'),
        medal('You helped fix the club. The Ogre Warrior thanked you and gave you an Honor Medal.'),
      ],
    ],
  },
  {
    story: '"Fire in the hole!" You heard a loud voice and turned your head. A Goblin Tech was testing his cannon.',
    choices: [
      'Duck to the right',
      'Duck to the left',
      'Stay where you are',
    ],
    results: [
      [
        die('While trying to duck the cannon ball, you panicked and stumbled. Kaboom!'),
        live('You ducked to the left just in time. Phew.'),
        live('You didn\'t move, and the fireball missed you. What a luck!'),
      ],
      [
        live('You ducked to the right just in time. Phew.'),
        die('You ducked to the left, and the fireball missed you.\n⋮\nWait, a debris hit you.'),
        live('You didn\'t move, and the fireball missed you. What a luck!'),
      ],
      [
        live('You ducked to the right just in time. Phew.'),
        live('You ducked to the left just in time. Phew.'),
        die('You didn\'t move. Then you looked down and saw an X mark under your feet. Oops.'),
      ],
    ],
  },
  {
    story: 'You heard a rustle in the woods. A Rhino Knight was charging toward you.',
    choices: [
      'Move aside to let the Knight pass',
      'Stay where you are',
    ],
    results: [
      [
        die('You moved aside to let the Knight pass.\n⋮\nYou heard another rustle. There was a second Rhino Knight!'),
        live('You did not move. The Rhino Knight saw you and stopped. That was close.'),
      ],
      [
        live('You moved aside to let the Rhino Knight pass.'),
        die('You did not move. The Knight tried to halt his rhino but could\'t. You were run over.'),
      ],
      [
        live('You moved aside to let the Rhino Knight pass.'),
        live('False alarm! The Rhino Knight turned and rode away….'),
      ],
    ],
  },
  {
    story: 'You saw an Iron Guard strugging to get something off his feet. Some magnet was stuck to his boot.',
    choices: [
      'Ignore and keep walking',
      'Help the Iron Guard',
    ],
    results: [
      [
        die('The Iron Guard got the magnet off on his own, but the magnet flew out of his hand and hit you.'),
        medal('You helped the Iron Guard.\nGuess what? It was an Honor Medal. Woohoo!'),
      ],
      [
        live('You ignored the Iron Guard and kept walking. That was cold.'),
        die('You helped the Iron Guard.\n⋮\nOh no! It was a landmine!'),
      ],
      [
        live('You ignored the Iron Guard and kept walking. That was cold.'),
        live('You helped the Iron Guard. That was nice of you.'),
      ],
    ],
  },
  {
    story: 'A gust of wind knocked down a baby Demon. The Demon was stuck in a tree and asked for your help',
    choices: [
      'Help the baby Demon',
      'Ignore and keep walking',
    ],
    results: [
      [
        win('You helped the baby Demon. The Demon thanked you and flew you to the finish line.'),
        live('You walked past the Demon and pretended not to hear the cryng call.'),
      ],
      [
        die('You climbed the tree to help the Demon. The branch snapped and you fell.'),
        live('You walked past the Demon and pretended not to hear the cryng call.'),
      ],
      [
        medal('You climbed the tree to help the Demon. The Demon thanked you and gave you an Honor Medal.'),
        live('You apologized to the Demon that you couldn\'t help and hurried on.'),
      ],
      [
        live('You climbed the tree and freed the the Demon. The Demon thanked and hugged you.'),
        die('You pretended not to hear the Demon and walked on. The baby Demon freed herself. She was upset and attacked you from behind.'),
      ],
      [
        live('You tried to climb the tree but couldn\'t reach the Demon. You were about to give up when Mephisto showed up and saved his baby!'),
        live('Mephisto heard the crying call and flew in to save his baby!'),
      ],
    ],
  },
  {
    story: 'You saw a mysterious chest in the middle of the road.',
    choices: [
      'Open the chest',
      'Don\'t open the chest',
    ],
    results: [
      [
        die('You opened the chest and found a Voodoo Doll inside. He was playing hide-and-seek and wasn\'t thrilled that you blew his cover. He stabbed you with his needle.'),
        live('You walked past the chest.'),
      ],
      [
        medal('Woohoo! You opened the chest and found an Honor Medal.'),
        live('You walked past the chest. Fortune favors the cautious.'),
      ],
      [
        live('You opened the chest but found nothing. Better luck next time.'),
        die('You walked past the chest.\n\n"Boo!" A naughty Skeleton was hiding behind the chest and gave you a heart attack.'),
      ],
    ],
  },
  {
    story: 'You saw a gold chest and a gray chest in the middle of the road.',
    choices: [
      'Open the gold chest',
      'Open the gray chest',
      'Don\'t open any chest',
    ],
    results: [
      [
        live('You opened the gold chest and found some coins.'),
        live('You opened the gray chest and found a Hell Jailer who was trapped inside. The Hell Jailer thanked you and flew away.'),
        live('You passed on the opportunity and walked on.'),
      ],
      [
        medal('You opened the gold chest and found an Honor Medal. Oh yeah!'),
        live('You opened the gray chest and found some used nakpins.'),
        live('You decided not to take your chance and moved on.'),
      ],
      [
        die('You opened the gold chest. A Pumpkin Guard jumped out and frightend you.'),
        live('You opened the gray chest and found nothing.'),
        live('You ignored the chests and walked on.'),
      ],
    ],
  },
  {
    story: 'You reached a wall with three caves.',
    choices: [
      'Enter the left cave',
      'Enter the center cave',
      'Enter the right cave',
    ],
    results: [
      [
        live('You entered the left cave. It was very dark inside but you eventually made it to the other side.'),
        live('You entered the center cave. It was very dark inside but you eventually made it to the other side.'),
        live('You entered the right cave. It was very dark inside but you eventually made it to the other side.'),
      ],
      [
        die('You entered the left cave and wandered into Spider Queen\'s lair. The Queen was feeling hungry.'),
        circle('You entered the center cave and circled out from the right cave. It looked like the left cave was the correct one.'),
        live('You entered the left cave and wandered into Spider Queen\'s lair. Fortunately the Queen wasn\'t home. You came out through the other side.'),
      ],
      [
        circle('You entered the left cave and circled out from the center cave. It looked like the right cave was the correct one.'),
        live('You entered the center cave and found the Spider Queen. Lucky for you she was sleeping. You sneaked past the Queen and came out through the other side.'),
        die('You entered the left cave and wandered into Spider Queen\'s lair. The Queen was sleeping so you sneaked past her.\n⋮\nOh no! Some exploding spiders sneaked on you and smoked you.'),
      ],
      [
        live('You entered the left cave and saw the Spider Queen. The Queen just finished her meal so she let you pass.'),
        die('You entered the center cave and found the Spider Queen. You slowly backed out of the cave but got caught by sticky spider webs. The Spider Queen turned and found you.'),
        circle('You entered the right cave and circled out from the center cave. It looked like the right cave was the correct one.'),
      ],
    ],
  },
  {
    story: 'You reached a transport depot. A Ghost Assassin and a Magic Apprentice was about to depart.',
    choices: [
      'Get a ride from the Ghost Assassin',
      'Get a ride from the Magic Apprentice',
    ],
    results: [
      [
        win('You got a ride from the Ghost Assassin. Hooray, the Assassin blinked you to the finishing line.'),
        move(1, 'You took a short a ride from the Magic Apprentice.'),
      ],
      [
        restart('You got a ride from the Ghost Assassin. Ugh the rascal took you to the starting line!'),
        move(2, 'You got a short a ride from the Magic Apprentice.'),
      ],
      [
        move(2, 'You got a short ride from the Ghost Assassin.'),
        move(3, 'You got a short a ride from the Magic Apprentice.'),
      ],
      [
        move(5, 'You got a short ride from the Ghost Assassin.'),
        move(4, 'You got a short a ride from the Magic Apprentice.'),
      ],
      [
        die('You asked the Ghost Assassin for a ride. A flash of light blinded you. When you opened your eyes, you saw that you were heading straight into a group of Goblikazes. You crashed and burned.'),
        circle('You asked the Magic Apprentice for a ride. Unfortunately her bloom broke down and you had to walk.'),
      ],
    ],
  },
  {
    story: 'You hear a swishing sound and look up. Cyclops is practicing boulder throwing and a boulder is flying your way.',
    choices: [
      'Hide behind a tree',
      'Hide behind a rock',
    ],
    results: [
      [
        die('You quickly hid behind a tree but accidentally stepped on a snake. Oops.'),
        live('You hid behind a rock and the boulder swished pass you.'),
      ],
      [
        die('You quickly hid behind a tree. Bad choice! The boulder hit the tree… and you.'),
        live('You quickly hid behind a rock. Good choice! The boulder hit the tree.'),
      ],
      [
        live('You quickly hid behind a tree. Good choice! The boulder hit the rock.'),
        die('You hid behind a rock and the boulder swished pass you.\n⋮\nYou came out from hiding and saw another boulder coming your way….'),
      ],
      [
        live('You quickly hid behind a tree. Good choice! The boulder hit the rock.'),
        die('quickly hid behind a rock and the boulder missed you.\n⋮\nWait, some debris hit you.'),
      ],
      [
        live('You quickly hid behind a tree. Good choice! The boulder hit the rock.'),
        live('You quickly hid behind a rock. Good choice! The boulder hit the tree.'),
      ],
    ],
  },
  {
    story: 'You fell into a trap hole. You heard thumping footstep noises closing in.',
    choices: [
      'Hide',
      'Don\'t hide',
    ],
    results: [
      [
        die('You pressed yourself against the wall and held your breadth. After the noise subsided, you came out and waited for help.\n⋮\nNo one ever came.'),
        live('You stood and waited. It was a friendly Meteor Golem. He threw you a rope and helped you get out.'),
      ],
      [
        die('You pressed yourself against the wall and held your breadth. You heard a voice saying "hmm… who dug a hole here?" Then you heard a thump and looked up. Someone closed the trap opening with a giant rock!'),
        live('You stood and waited. It was a friendly Witchcraft Totem. He threw you a rope and helped you get out.'),
      ],
      [
        live('You pressed yourself against the wall and held your breadth. After the noise subsided, you came out and climbed out of the wall.'),
        die('You stood and waited. It was a genetically modified Ogre Warrior. He jumped into the hole and ate you.'),
      ],
      [
        live('You pressed yourself against the wall and held your breadth. After the noise subsided, you came out and climbed out of the wall.'),
        die('You stood and waited. It was a genetically modified, carnivorous Cactus. It extended out a vine to grab you. You pleaded for mercy to no avail.'),
      ],
      [
        live('You pressed yourself against the wall and held your breadth. After the noise subsided, you came out and climbed out of the wall.'),
        live('You stood and waited. It was a friendly Stone Golem. He threw you a rope and helped you get out.'),
      ],
    ],
  },
  {
    story: 'You felt tired and thirsty. A Magic Apprentice happened to be selling some mysterious potion nearby.',
    choices: [
      'Buy the potion',
      'Don\'t buy the potion',
    ],
    results: [
      [
        die('You bought the potion and drank it. You had allergic reaction and exploded.'),
        live('You walked on and found a river with raspberry bushes nearby. You took a well deserved rest.'),
      ],
      [
        live('You bought the potion and drank it. Wow, the magic potion energized you.'),
        die('The feeling of thirst overwelmed you. You dropped to the groud, never getting up again.'),
      ],
      [
        live('You bought the potion and drank it. You felt much better.'),
        live('You walked on and found the fountain of youth. You drank from the fountain and felt much better.'),
      ],
    ],
  },
  // {
  //   story: 'A bear rushed past you. You heard a loud yell, "catch that bear". You turned and saw a Beast Master. His beast was loose.',
  //   choices: [
  //     'Don\'t help the Master',
  //     'Help the Beast Master',
  //   ],
  //   results: [
  //     [
  //       die(''),
  //       live(''),
  //     ],
  //   ],
  // },
  // {
  //   story: 'You met a Viking Warrior who challenged you to a duel to the death.',
  //   choices: [
  //     'Accept the challenge',
  //     'Decline the challenge',
  //   ],
  //   results: [
  //     [
  //       die(''),
  //       live(''),
  //     ],
  //   ],
  // },
];

/* eslint-enable max-len */

/** a RiNG game */
class Game {
  /**
   * @param {Interaction} i First interaction
   */
  constructor(i) {
    this.playerName = (i.member.nickname||i.member.user.username);
    this.status = STATUS_ALIVE;
    this.medal = 1;
    this.position = 0;
    this.enrollmentInteraction = i;
    // send a welcome message
    i.followUp(WELCOME);
    console.log(`${this.playerName} has joined the RiNG.`);
  }

  /** Start the game */
  async start() {
    this.enrollmentInteraction.followUp(START);
    pause(3).then( (resolve) => this.next() );
  }

  /** Next level */
  async next() {
    const scenario = SCENARIOS[diceRoll(SCENARIOS.length)];
    const results = scenario.results[diceRoll(scenario.results.length)];
    const buttons = [];
    for (let bi = 0; bi < scenario.choices.length; bi++) {
      buttons.push({
        type: 2, label: scenario.choices[bi],
        style: 1, custom_id: bi.toString(),
      });
    }
    const content = {
      embeds: [{
        description: scenario.story,
        color: BLUE,
      }],
      ephemeral: true,
      components: [{type: 1, components: buttons}],
    };
    this.enrollmentInteraction.followUp(content).then( (msg) => {
      msg
          .createMessageComponentCollector(RESPONSE_FILTER)
          .on('collect', async (response) => {
            this.resolve(response, results);
          });
    });
  }

  /**
   * @param {Interaction} response
   * @param {Array} results
   */
  async resolve(response, results) {
    response.deferUpdate();
    const newResponse = {embeds: [], ephemeral: true};
    const result = results[parseInt(response.customId)];
    newResponse.embeds.push({
      description: result.message,
      color: BLUE,
    });

    switch (result.result) {
      case 'medal':
        this.medal++;
        break;
      case 'live':
        this.position++;
        if (this.position >= FINISH_LINE) {
          this.status = STATUS_VICOTRY;
          newResponse.embeds.push(VICTORIOUS);
        }
        break;
      case 'die':
        if (this.medal) {
          this.medal--;
          newResponse.embeds.push(REVIVE);
          this.position = 0;
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          newResponse.embeds.push(MASTER_REVIVE);
          this.position = 0;
        } else {
          this.status = STATUS_DEAD;
          newResponse.embeds.push(LOST);
        }
        break;
    }

    this.enrollmentInteraction.followUp(newResponse);
    if (this.status == STATUS_ALIVE) {
      pause(3).then( (resolve) => this.next() );
    }
  }
}

const lotr = {
  name: 'ring',
  enroll(msg) {
    const games = [];
    const contestantIds = [];
    const collector = msg
        .createMessageComponentCollector(ENTROLL_FILTER);
    collector.on('collect',
        async (interaction) => {
          interaction.deferUpdate();
          if (contestantIds.includes(interaction.member.id)) return;
          game = new Game(interaction);
          games.push(game);
          contestantIds.push(interaction.member.id);
        },
    );
    collector.on('end', (collected) => {
      msg.edit({embeds: msg.embeds, components: []}); // remove JOIN button
      games.forEach((g) => g.start());
    });
  },
  async execute(cmdRes, settings, msg, args) {
    // if (inprocess) return;
    // inprocess = true;
    if (!GAME_CHANNELS.includes(msg.channelId)) return;
    msg.channel.send(ANNOUNCEMENT).then((msg)=>this.enroll(msg));
  },
};

module.exports = lotr;
