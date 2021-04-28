/* eslint-disable max-len */

const fs = require('fs');
const path = require('path');

const SPLASH = fs.readFileSync(path.resolve(__dirname, 'splash.md'), 'utf8');
const GREETING = fs.readFileSync(path.resolve(__dirname, 'greeting.md'), 'utf8');

module.exports = {
  SPLASH: SPLASH,
  GREETING: GREETING,
  EMBED_FOOTER: 'Information contributed by AoW players.',

  NO_INFO: 'I have no information for {1}',
  NO_COMMENT: 'I have no comment!',

  TROOPS_ALIASES: [
    // first item is the correct spelling, the rest alternate spellings
    ['infantry'],
    ['iron guards', 'iron guard'],
    ['hell jailers', 'hell jailer'],
    ['fire mage'],
    ['ice mage'],
    ['viking warrior'],
    ['scholar'],
    ['templar knight'],
    ['undead soldier', 'undead soldiers', 'undead'],
    ['harbinger of fire', 'harbingers of fire', 'hof'],
    ['paladin', 'paladins'],
    ['pilgrims', 'pilgrim'],
    ['brawlers', 'brawler'],
    ['nun', 'nuns'],
    ['voodoo dolls', 'voodoo doll', 'voodoo'],
  ],

  TROOPS_DISPLAY_NAMES: {
    'infantry': 'Infantry',
    'iron guards': 'Iron Guards',
    'hell jailers': 'Hell Jailers',
    'fire mage': 'Fire Mage',
    'ice mage': 'Ice Mage',
    'viking warrior': 'Viking Warrior',
    'scholar': 'Scholar',
    'templar knight': 'Templar Knight',
    'undead soldier': 'Undead Soldier',
    'harbinger of fire': 'Harbinger of Fire',
    'paladin': 'Paladin',
    'pilgrims': 'Pilgrims',
    'brawlers': 'Brawlers',
    'nun': 'Nun',
    'voodoo dolls': 'Voodoo Dolls',
  },

  COMMAND_RELOAD_DESC: 'Reloads a command.',
  COMMAND_RELOAD_NOT_FOUND: 'There is no command with name or alias of "{1}"',

  COMMAND_HELP_DESC: 'Show help for a specified command..',
  COMMAND_HELP_USAGE: '[command name]',
  COMMAND_HELP_ALIASES: ['h', 'commands'],
  COMMAND_HELP_HELP: 'Type \`{PREFIX}help <command>\` to get more information about a specific command.\n\n**Commands available:**\n{COMMANDS}',
  COMMAND_HELP_LABEL_ALIASES: 'Aliases',
  COMMAND_HELP_LABEL_DESC: 'Description',
  COMMAND_HELP_LABEL_USAGE: 'Usage',
  COMMAND_HELP_LABEL_EXAMPLE: 'Example',
  COMMAND_HELP_NOT_FOUND: 'This command does not exist.',

  COMMAND_BUILDING_DESC: 'Tips for building your barrack.',
  COMMAND_BUILDING_ALIASES: [],
  COMMAND_BUILDING_FILES: [
    path.resolve(__dirname, 'building', 'building1.json'),
    path.resolve(__dirname, 'building', 'building2.json'),
    path.resolve(__dirname, 'building', 'building3.json'),
  ],

  COMMAND_WOF_ALIASES: ['wheel'],
  COMMAND_WOF_PLUS: 'The probability of getting {HIT_RANGE} or more {UNIT} in {SPIN_COUNT} spins is {PROB}%.',
  COMMAND_WOF_RANGE: 'The probability of getting {HIT_RANGE_1} to {HIT_RANGE_2} {UNIT} in {SPIN_COUNT} spins is {PROB}%.',
  COMMAND_WOF_EXACT: 'The probability of getting exactly {HIT_RANGE} {UNIT} in {SPIN_COUNT} spins is {PROB}%.\n{LOG}',
  COMMAND_WOF_EXACT_LOG: '{PROB}% probability of {HIT_1}×{QTY_1} + {HIT_2}×{QTY_2} {UNIT}\n',
  COMMAND_WOF_MODE: 'With {SPIN_COUNT} spins, the __mode__ is {TOTAL_QTY} {UNIT} ({PROB}% probability).',
  COMMAND_WOF_VOUCHERS: ['voucher', 'vouchers'],
  COMMAND_WOF_SHARDS: ['hero', 'shards', 'shard'],
  COMMAND_WOF_UNIT_VOUCHERS: 'vouchers',
  COMMAND_WOF_UNIT_SHARDS: 'shards',

  COMMAND_HERO_DESC: 'Information about heroes.',
  COMMAND_HERO_USAGE: 'aly|selene',
  COMMAND_HERO_ALIASES: [],
  COMMAND_HERO_MAP: {
    'meta': path.resolve(__dirname, 'heroes', 'meta.json'),
    'aly': path.resolve(__dirname, 'heroes', 'aly.json'),
    'selene': path.resolve(__dirname, 'heroes', 'selene.json'),
  },

  COMMAND_TROOPS_DESC: 'Information about troops.',
  COMMAND_TROOPS_USAGE: '<troops name>',
  COMMAND_TROOPS_ALIASES: ['troop'],
  COMMAND_TROOPS_BLACKLIST: 'infantry,iron guards,hell jailers,fire mage,viking warrior,scholar,templar knight',
  COMMAND_TROOPS_FILES: {
    'paladin': path.resolve(__dirname, 'troops', 'paladin.json'),
    'pilgrims': path.resolve(__dirname, 'troops', 'pilgrims.json'),
    'brawlers': path.resolve(__dirname, 'troops', 'brawlers.json'),
    'nun': path.resolve(__dirname, 'troops', 'nun.json'),
    'voodoo dolls': path.resolve(__dirname, 'troops', 'voodoo dolls.json'),
  },

  COMMAND_PLUS_SEONDEOK_DESC: 'Calculate the effect of Seondeok on troops.',
  COMMAND_PLUS_SEONDEOK_USAGE: '<hero level> <troops name> <troops level>',
  COMMAND_PLUS_SEONDEOK_USAGE_EXAMPLE: '15 \'undead soldier\' 9',
  COMMAND_PLUS_SEONDEOK_ALIASES: ['+seon'],
  COMMAND_PLUS_SEONDEOK_INTRO: 'When a level {TROOPS LEVEL} {TROOPS} is used with level {HERO LEVEL} Seondeok, the effect is as followed.\n',
  COMMAND_PLUS_SEONDEOK_DAMAGE: '**Damage** = ({ATTACK} - *enemy unit\'s defense*) + {ADD DAMAGE}\n  *(about {EQUIV INCREASE}% attack increase)*\n',
  COMMAND_PLUS_SEONDEOK_AOE: '**AoE Range**: {AOE RANGE}\n**AoE Attack**: {AOE ATTACK}\n',

};
