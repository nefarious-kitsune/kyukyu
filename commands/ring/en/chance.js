'use strict';

/*
 * Normal scenarios where a player has some chance of getting a medal.
 * Each choice has a differnet probability of elminiation
 */

const {SCENARIO_TYPE} = require('../src/common');
const {survived, eliminated, medalX1, medalX2, medalX3} =
    require('./resolutions');

const HELP_DONT_HELP = ['Help', 'Don\'t help'];

/* eslint-disable max-len */
module.exports = [
  {
    type: SCENARIO_TYPE.CHANCE, choices: HELP_DONT_HELP,
    story: 'You saw an Ogre Warrior sitting on the side of the road, crying. His club was broken.',
    results: [
      [ // Help
        medalX1('You helped fix the Ogre\'s club. The Ogre Warrior thanked you and gave you an Honor Medal.'),
        medalX1('You found a log and fashioned it into a club. The Ogre Warrior was impressed and gifted you an Honor Medal.'),
        survived('You offered to help, but the Ogre Warrior didn\'t hear you. You moved on.'),
        eliminated('You offered to help. The Ogre Warrior did not want help and ate you.'),
        eliminated('You gathered a branch and a sharp-edged stone, and you made an axe. The Ogre, somewhat confused, swung the axe a bit and hit you by mistake.'),
      ],
      [ // Don't help
        survived('You pretended not to see the Ogre Warrior and kept walking.'),
        survived('You ignored the Ogre Warrior and kept walking. That was heartless of you.'),
        eliminated('You walked on but tripped over the Ogre Warrior\'s broken club.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.CHANCE, choices: HELP_DONT_HELP,
    story: 'You saw an Iron Guard struggling to get something off. Some magnet was stuck to his boot.',
    results: [
      [ // Help
        medalX1('You helped the Iron Guard to take the magnet off.\nGuess what? It was an Honor Medal. Booyah!'),
        medalX1('You helped the Iron Guard remove the magnet. The Iron Guard thanked you and gave you an Honor Medal.'),
        survived('You grabbed on the magnet and pulled it off the Iron Guard\'s boot. That was nice of you.'),
        eliminated('You helped the Iron Guard remove the magnet.\n⋮\nOh no! It was a magnetic bomb!'),
        eliminated('You grabbed on the magnet and pulled hard. You got it off, stumbled backward, and fell off a cliff behind you.'),
      ],
      [ // Don't help
        survived('You ignored the Iron Guard and kept walking. That was cold.'),
        survived('You avoided eye contact with the Iron Guard and quickly walked past him. Aww, that\'s cruel.'),
        eliminated('You moved on. The Iron Guard got the magnet off on his own, but the magnet flew out of his hand and hit you.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.CHANCE, choices: HELP_DONT_HELP,
    story: 'A gust of wind knocked a baby Demon off course. The Demon was stuck in a tree and asked for your help.',
    results: [
      [
        medalX1('You climbed the tree to help the baby Demon. She thanked you and gave you an Honor Medal.'),
        medalX1('You tried to climb the tree but couldn\'t reach the Demon.\n\nMephisto flew in and saved his baby! Mephisto thanked you for trying and gifted you an Honor Medal.'),
        survived('You tried to climb the tree but couldn\'t reach the Demon. You were about to give up when Mephisto showed up and saved his baby!'),
        eliminated('You climbed the tree to help the Demon. A branch snapped and you fell.'),
        eliminated('You climbed the tree and freed the Demon. While you descended, you slipped and tumbled down.'),
      ],
      [
        survived('You hurriedly walked past the baby Demon. Shame on you!'),
        survived('You apologized to the Demon that you couldn\'t help and hurried on.'),
        eliminated('You ignored the the Demon and walked on. The baby Demon freed herself. She was upset that you hadn\'t helped and attacked you from behind.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.CHANCE,
    story: 'You saw a mysterious chest in the middle of the road.',
    choices: ['Open the chest', 'Don\'t open the chest'],
    results: [
      [
        medalX1('You opened the chest and found an Honor Medal. Woohoo!'),
        medalX2('You opened the chest and found a smaller chest. You opened the smaller chest and found a tiny chest. You opened the tiny chest and found 2 Honor Medals.'),
        survived('You opened the chest but found nothing. Better luck next time.'),
        eliminated('You opened the chest and found a Voodoo Doll inside. He was playing hide-and-seek and wasn\'t thrilled that you blew his cover. He pricked you with his needle.'),
        eliminated('You opened the chest. Wahhhh…! A Pumpkin Guard jumped out and frightened you.'),
      ],
      [
        survived('You paused and thought about it. You decided not to open the chest.'),
        survived('You decided not to take your chance. Fortune favors the cautious.'),
        eliminated('You walked past the chest.\n\n"Boo!" A naughty Skeleton was hiding behind the chest and gave you a heart attack.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.CHANCE,
    story: 'You saw a gold chest and a gray chest in the middle of the road.',
    choices: ['Open the gold chest', 'Open the gray chest'],
    results: [
      [
        medalX3('You opened the gold chest and were taken aback by a flock of bats. You gathered yourself and found three3 Honor Medals in the chest. Jackpot!'),
        medalX2('You opened the gold chest and was disappointed to see nothing but cobwebs and junk. Then a glitter caught your eye. Within all that junk were two Honor Medals. Nice!'),
        survived('You opened the gold chest and found some coins.'),
        eliminated('You opened the gold chest. A Pumpkin Guard jumped out and frightend you.'),
        eliminated('You opened the gold chest. A genetically-modified, carnivorous Cactus was resting inside.'),
      ],
      [
        medalX1('You opened the gray chest and found a Hell Jailer trapped inside. The Hell Jailer thanked you and flew away. As you closed the chest you saw an Honor Medal inside.'),
        survived('You opened the gray chest and found some used nakpins.'),
        survived('You opened the gray chest and found nothing.'),
        eliminated('You opened the gray chest and found a small box inside. The box was locked. You shoock the box and then put it to your ear.\n\n"Tick tock, tick tock" Oh no, it\'s a time bomb!'), // 20%
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.CHANCE,
    story: 'You came upon a strange place with many rock pillars. You heard loud breathing sound. You peered through the rocks and saw Cerberus sleeping. Beside one of it\'s foot was an Honor Medal.',
    choices: ['Take the Medal', 'Don\'t take the Medal'],
    results: [
      [
        medalX1('You sneaked in. Cerberus stirred and you quickly hid behind a rock pillar.\n\nAfter a long wait, you came out of hiding. The creature was still sleeping. You took the Medal and quickly sneaked out.'),
        medalX1('You ventured close to Cerberus. The creature woke up and roared at you. You found a dead branch, picked it up, and threw it away. Cerberus ran after the branch. You quickly picked up the Medal and ran for your life.'),
        survived('You ventured to take the Honor Medal. The creature stirred and you quickly hid behind a rock pillar.\n\nAfter a long wait, you came out of hiding. Cerberus had moved it\'s feet and was now on top of the Medal. Well, better luck next time.'),
        survived('You ventured to take the Honor Medal. The creature woke up and roared at you. You ran for your life. Lucky for you Cerberus was chained up and didn\'t come after you.'),
        eliminated('You ventured to take the Honor Medal. The creature stirred and you quickly hid behind a rock pillar.\n\nAfter a long wait, you came out of hiding and saw Cerberus staring right at you.'),
        eliminated('You ventured close to Cerberus. The creature woke up and roared at you. You found a dead branch, picked it up, and threw it away. That only made Cerberus mad (it was no puppy, you know).'),
      ],
      [
        survived('You sneaked past the rocky formation but accidentally stepped on a dead branch. Cerberus stirred, squinted at you, and then went back to sleep.'),
        survived('You cautiously sneaked past the rocky formation.'),
        survived('You used rock pillars as cover and sneaked past the creature.'),
        eliminated('You used rock pillars as cover and sneaked past the creature. You pushed on one of the rock pillar too hard and some rubbles fell and smashed your head.'),
      ],
    ],
  },
];

// survived('You climbed the tree and freed the the Demon. The Demon thanked and hugged you.'),
// survived('You decided not to take your chance and hurried on.'),
