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

  TROOPS_MAP: [
    // first item is the correct spelling, the rest alternate spellings
    ['infantry'],
    ['iron guards', 'iron guard'],
    ['hell jailers', 'hell jailer'],
    ['fire mage'],
    ['viking warrior'],
    ['scholar'],
    ['templar knight'],
    ['undead soldier', 'undead soldiers', 'undead'],
    ['paladin', 'paladins'],
    ['pilgrims', 'pilgrim'],
    ['brawlers', 'brawler'],
    ['nun', 'nuns'],
    ['voodoo dolls', 'voodoo doll', 'voodoo'],
  ],

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
  COMMAND_WOF_EXACT_LOG: '{PROB}% probability of {QTY_1}×{HIT_1} + {QTY_2}×{HIT_2} {UNIT}\n',
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
  COMMAND_TROOPS_MAP: {
    'paladin': path.resolve(__dirname, 'troops', 'paladin.json'),
    'pilgrims': path.resolve(__dirname, 'troops', 'pilgrims.json'),
    'brawlers': path.resolve(__dirname, 'troops', 'brawlers.json'),
    'nun': path.resolve(__dirname, 'troops', 'nun.json'),
    'voodoo dolls': path.resolve(__dirname, 'troops', 'voodoo dolls.json'),
  },
};
