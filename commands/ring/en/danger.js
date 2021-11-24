'use strict';

/*
 * Normal scenarios where a player is in imminent danger.
 * All choices have same probability of elminiation
 */

const {SCENARIO_TYPE} = require('../src/common');
const {survived, eliminated} = require('./resolutions');

/* eslint-disable max-len */
module.exports = [
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'The road diverged in front of you. A Goblikazes was nodding off at the junction.',
    choices: ['Take the left road', 'Take the right road'],
    results: [
      [
        survived('You took the left road.'),
        survived('You chose to go left.'),
        eliminated('You took the left road but accidentally knocked over the Goblikaze\'s pot.'),
        eliminated('You went left and saw something shiny on the road. It was an Honor Medal!\n⋮\nUh-oh, you got too excited and woke up the Goblikaze. He was not pleased.'),
      ],
      [
        survived('You took the "right" road.'),
        survived('You chose to go right.'),
        eliminated('You took the right road but unwittingly knocked over the Goblikaze\'s pot.'),
        eliminated('You went right and found some coins on the ground. You bent over to pick them up and accidentally knocked over the Goblikaze\'s pot.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You were at a crossroads. One path led to a dense, dark forest. Another path led to a treacherous moutain.',
    choices: ['Go through the forest', 'Climb the mountain'],
    results: [
      [
        survived('You entered the forest and quickly found a shortcut. You exited the forest with ease.'),
        survived('You went through the dark forest and got lost. Could this be your end?\n⋮\nGreen stumbled upon you. He took you on his shoulder and carried you out of the forest.'),
        eliminated('You went through the dark forest and got lost. You wandered and wandered until you collapsed.'),
      ],
      [
        survived('You made a difficult journey climbing the mountain but made it to the other side.'),
        survived('You went up the mountain and found a tunnel leading straight to the other side. That was easy.'),
        eliminated('You decided to climb the mountain. You were exhausted before you reached the top. You should\'ve gone through the forest.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: '"Fire in the hole!" You heard a loud voice and turned your head. A Goblin Tech was testing his cannon.',
    choices: ['Duck left', 'Stay still', 'Duck right'],
    results: [
      [
        survived('You dived left just in time. Phew.'),
        survived('You jumped to your left just in time. That was close.'),
        eliminated('You ducked left, and the fireball narrowly missed you.\n⋮\nWait, a debris hit you.'),
      ],
      [
        survived('You stood still and the fireball landed just in front of you. Good gracious that was gutsy.'),
        survived('You didn\'t move and the fireball swished past you. What a luck!'),
        eliminated('You didn\'t move. Then you looked down and saw an X mark under your feet. Oops.'),
      ],
      [
        survived('You dashed to your right and narrowly dodged the fireball. Phew.'),
        survived('You ran to your right but stumbled and fell. The fireball dropped just a few steps in front of you. That\'s some dumb luck.'),
        eliminated('You sprinted right. In a panic, you stumbled on a rock and fell. Kaboom!'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You heard a rustle in the woods. A Rhino Knight was charging toward you.',
    choices: ['Move aside', 'Stay still'],
    results: [
      [
        survived('You moved aside and the Rhino Knight whisked by you.'),
        survived('You moved aside to let the Rhino Knight pass.'),
        eliminated('You moved aside to let the Knight pass.\n⋮\nYou heard another rustle. There was a second Rhino Knight!'),
      ],
      [
        survived('You did not move. The Rhino Knight saw you and stopped. That was close.'),
        survived('False alarm! The Rhino Knight turned sharply and rode away….'),
        eliminated('You didn\'t move. The Knight tried to halt his rhino but could\'t. You were trampled over.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You reached a cliff with three tunnels. You needed to choose a tunnel.',
    choices: ['Left', 'Middle', 'Right'],
    results: [
      [
        survived('You entered the left tunnel. It was very dark inside but you eventually made it to the other side.'),
        survived('You entered the left tunnel and saw the Spider Queen. The Queen just finished her meal so she let you pass.'),
        eliminated('You chose the left tunnel. The tunnel was surprisingly wide and straight, and you quickly reached the exit.\n⋮\nThen, you felt a sting in the back. The Spider Queen had sneaked upon you!.'),
        eliminated('You entered the left tunnel and felt your way in the dark. *Squish*. You looked down and found that you stepped on some eggs. You looked up and saw the Spider Queen starring right at you.'),
      ],
      [
        survived('You took the middle tunnel. You slipped and fell into a subterranean river. You struggled against the strong current with all your might. When you resurfaced, you were out in the open. Exhausted, you climbed ashore and took a long rest.'),
        survived('You chose the middle tunnel and came to Spider Queen\'s cavern. Lucky for you the Queen was sleeping. You sneaked past the Queen and came out safely.'),
        eliminated('You entered the middle tunnel and found the Spider Queen. You slowly and quietly backed out but got caught by sticky spider webs. The Spider Queen turned and found you.'),
        eliminated('You entered the middle tunnel and felt your way in the dark. You stepped into a hole and fell right on top of a sleeping Spider Queen. The Queen woke up and was infuriated.'),
      ],
      [
        survived('You entered the right tunnel and circled out from the middle tunnel. It looked like the left tunnel was the correct one.'),
        survived('You entered the right tunnel and wandered into Spider Queen\'s lair. Fortunately the Queen wasn\'t home. You came out safely.'),
        eliminated('You took the right tunnel and wandered into Spider Queen\'s lair. The Queen was sleeping so you sneaked past her.\n⋮\nOh no! Some exploding spiders sneaked on you and smoked you.'),
        eliminated('You took the right tunnel and found a cavern where some Exploding Spiders were playing. They were excited to see you and wanted to play with you….'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You reached a river and needed to get across. There was a transport depot nearby. A Ghost Assassin and a Magic Apprentice were about to depart. You needed to choose a ride.',
    choices: ['Choose Ghost Assassin', 'Choose Magic Apprentice'],
    results: [
      [
        survived('You got a ride from the Ghost Assassin.'),
        survived('You chose the Ghost Assassin. The Assassin didn\'t see you and blinked away. Oh well you had swim across the river.'),
        eliminated('You got a ride from the Ghost Assassin. Ugh the rascal Assassin blinked to the top of a volcano and dropped you!'),
        eliminated('You asked the Ghost Assassin for a ride. A flash of light blinded you. When you opened your eyes, you saw that you were heading straight into a group of Goblikazes. You crashed and burned.'),
      ],
      [
        survived('You got a ride from the Magic Apprentice.'),
        survived('You asked the Magic Apprentice for a ride. Unfortunately her bloom broke down and you had to swim across the river.'),
        eliminated('You got a ride from the Magic Apprentice. Oh no, the weather conditions weren\'t right. You met an air turbulence and crashed.'),
        eliminated('The Magic Apprentice took you on a nice ride. *Clap!* A lightning struck the Apprentice.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You heard distant rumbling sound and saw dark clouds gathering above you. You saw a cave and a tall tree.',
    choices: ['Hide in the cave', 'Hide under the tree'],
    results: [
      [
        survived('You took shelter in the cave. *Clap*! A lightning hit the tree and set it on fire.'),
        survived('You took shelter in the cave and waited out the rain.'),
        eliminated('You entered the cave to hide and saw a meditating Soul Hunter. The Soul Hunter was not happy that you disrupted his routine.'),
        eliminated('You entered the cave to hide. It started to rain heavily. You heard some rumbling sound and looked out. There was a rock slide and the cave\'s entrance was blocked!'),
      ],
      [
        survived('You took shelter under the tree. Soon heavy rain poured down. You heard some rumbling sound and looked to the cave. A rock slide just blocked the cave\'s entrance. Lucky you!'),
        survived('You took shelter under the tree and waited out the rain.'),
        eliminated('You took shelter under the tree. *Clap*! A lightning hit the tree and zapped you.'),
        eliminated('You ran to the tree and slipped and fell right into a trench. Before you could get out, heavy rain poured down and flooded the trench.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You heard a swishing sound and looked up. Cyclops was practicing boulder throwing and a boulder was flying your way.',
    choices: ['Hide behind a tree', 'Hide behind a rock'],
    results: [
      [
        survived('You hid behind a tree. Good choice! The boulder hit the rock.'),
        survived('You hid behind a tree and the boulder swished past you.'),
        eliminated('You hid behind a tree but accidentally stepped on a snake. Oops.'),
        eliminated('You hid behind a tree. Bad choice! The boulder hit the tree.'),
      ],
      [
        survived('You hid behind a rock. Good choice! The boulder hit the tree.'),
        survived('You hid behind a rock and the boulder swished past you.'),
        eliminated('You hid behind a rock and the boulder swished past you.\n⋮\nYou came out from hiding and saw another boulder coming your way….'),
        eliminated('You hid behind a rock and the boulder missed you.\n⋮\nWait, some debris hit you.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You fell into a trap hole. You heard thumping footstep noises closing in.',
    choices: ['Hide', 'Don\'t hide'],
    results: [
      [
        survived('You pressed yourself against the wall and held your breadth. After the noise subsided, you came out and climbed out of the wall.'),
        survived('You pressed yourself against the wall and held your breadth. "Hey buddy, what are you doing?" A voice came from above. It was a friendly Ogre Warrior. You felt silly and asked the Ogre for help.'),
        eliminated('You leaned against the wall and held your breadth. After the noise subsided, you came out and waited for help.\n⋮\nNo one ever came.'),
        eliminated('You pressed yourself against the wall and held your breadth. You heard a voice saying "hmm… who dug a hole here?" Then you heard a thump and looked up. Someone had closed the trap opening with a giant rock!'),
      ],
      [
        survived('You stood and waited. It was a friendly Stone Golem. He threw you a rope and helped you get out.'),
        survived('You stood and waited. It was a friendly Meteor Golem. He threw you a rope and helped you get out.'),
        eliminated('You stood and waited. It was a genetically-modified Ogre Warrior. He jumped into the hole and ate you.'),
        eliminated('You stood and waited. It was a genetically-modified, carnivorous Cactus. It extended out a vine to grab you. You pleaded for mercy to no avail.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You were thirsty and found a well. You bent over to get some water but lost your footing and fell right into the well. You saw a flimsy-looking rope hanging from the top.',
    choices: ['Use the rope', 'Wait for help'],
    results: [
      [
        survived('You used the rope to pull yourself out of the well.'),
        survived('You used the rope to climb out. Just as you neared the top, the rope scritched and started to thin out. You closed your eyes. Then something grabbed your hand. You looked up and saw a friendly Sacred Swordsman.'),
        survived('You pulled on the rope and started to climb. The rope snapped but luckily you weren\'t far from the ground. You didn\'t give up and climbed out with your bare hands.'),
        eliminated('You used the rope to climb out.\n⋮\nJust as you started walking, a bunny jumped out from a bush and startled you. You lost your footing again and fell back into the wall — this time, head first.'),
        eliminated('You used the rope to climb out, and the rope snapped….'),
      ],
      [
        survived('You waited for help. A Witchcraft Totem stopped by and helped you out.'),
        survived('You waited and called out for help. A squad of inquisitor was camping nearby and heard you. You were saved.'),
        survived('You waited and waited, but nobody came.\n⋮\nYou sighed and tried your luck with the rope. The rope held your weight. You were worrying too much!'),
        eliminated('You waited and called out for help. A Meteor Golem heard you and came to rescue you. Just as the Golem pulled you up, a rubble fell from him and hit you on the head. You lost your grip and fell.'),
        eliminated('You waited and waited. Suddenly it started to rain and the well was flooded.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You felt tired and thirsty. A Magic Apprentice happened to be selling some mysterious potion nearby.',
    choices: ['Buy the potion', 'Don\'t buy the potion'],
    results: [
      [
        survived('You bought the potion and drank it. Wow, the magic potion revitalized you.'),
        survived('You took the potion and felt much better.'),
        eliminated('You took the potion. You had allergic reaction and exploded.'),
      ],
      [
        survived('You walked on and found a river with raspberry bushes nearby. You took a well deserved rest.'),
        survived('You walked on and found the Fountain of Youth. You drank from the fountain and were rejuvenated.'),
        eliminated('You walked on. The thirst overwelmed you. You dropped to the groud, never getting up again.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You encountered a fight between a Brawler and a Peltast. One claimed to have the *strongest shield* while the other contested to have the *strongest spear*.',
    choices: ['Take the Peltast\'s side', 'Take the Brawler\'s side',
    ],
    // story: '你遇到了一名爭鬥者和投茅者在街上吵架。 一個聲稱他擁有__最強的盾牌__，而另一個則反駁說他有__最強的矛__.',
    // choices: ['站在爭鬥者那一邊', '站在投茅者那一邊'],
    results: [
      [
        survived('You took Peltast\'s side.\n\nThe Brawler challenged you to break his shield. You threw a spear against the shield and the spear broke. The Brawler laughed and ask you to try again. You obliged and, on your second try, broke the shield and killed the Brawler. Oops.'),
        survived('You took Peltast\'s side.\n\nThe Brawler held his shield and taunted you to break it. You took a spear and took a few steps back. You paused and took a few more steps back. You paused again, and the Brawler readied his shield.\n\nThen you turned and ran away.'),
        eliminated('You took Peltast\'s side.\n\nThe Brawler challenged you to break his shield. You threw a spear against the shield. The spear tip snapped off and pierced your forehead.'),
      ],
      [
        survived('You took Brawler\'s side. The Peltast shoved the shield in your hands, turned and took a few steps, and then suddenly swung around and threw his spear at you. The spear pierced the shield. Luckily the spear tip missed you. You dropped the shield and ran away.'),
        survived('You took Brawler\'s side. The Peltast forced you to hold the shield and threw his spear at the shield. The spear grazed the shield and hit a nearby tree where a Templar Knight was resting.\n\nYou took off before things got ugly.'),
        eliminated('You took Brawler\'s side. The Peltast compelled you to hold the shield. The Peltast threw a spear against the shield, and then another spear, and another… What a *Fighting Spirit*!\n⋮\nAnd the shield cracked.'),
      ],
    ],
  },
  {
    type: SCENARIO_TYPE.DANGER,
    story: 'You were at the foot of a hill. *Heave-ho!* You heard a shout. You looked up and saw group of pirates were carrying a ship. *That\'s weird,* you thought. The pirates set down the ship to take a break. Suddenly, the gravels under the ship gave way and the ship slid down in your direction. On your left was a ditch. On your right was a mound.',
    choices: ['Get in the ditch', 'Get behind the mound'],
    results: [
      [
        survived('You got in the ditch. Fortunately the ship slowed quickly and stopped mid hill.'),
        eliminated('You got in the ditch. Unfortunately the ship headed directly toward the ditch and crashed on top of you.'),
        // eliminated('You got in the ditch. Unfortunately the ship glanced off mound and turned over, the mast collapsing right on top of you.'),
      ],
      [
        survived('You got behind the mound. Fortunately the ship slowed quickly and stopped mid hill.'),
        eliminated('You got behind the mound. The ship slid past the mound and stopped. Then there was a squeaking sound. The ship tilted and turned over, the mast collapsing right on top of you.'),
      ],
    ],
  },
];
