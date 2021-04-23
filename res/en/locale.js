/* eslint-disable max-len */

const SPLASH =
`┌───────────────────────────────────────────────────────┐
│                                                       │
│  ─=≡Σ(((^._.^)彡                                     │
│ Catfish is overrated. Enters the foxfish...           │
│                                                       │
└───────────────────────────────────────────────────────┘`;

module.exports = {
  literal: function(template, ...strings) {
    let s = template;
    const str = [].slice.call(strings);
    for (let i = 0; i < str.length; i=i+2) {
      s = s.replace(str[i], str[i+1]);
    }
    return s;
  },
  SPLASH: SPLASH,
  EMBED_FOOTER: 'Information contributed by AoW players.',

  NO_INFO: 'I have no information for %1%',
  NO_COMMENT: 'I have no comment!',

  COMMAND_RELOAD_DESC: 'Reloads a command.',
  COMMAND_RELOAD_NOT_FOUND: 'There is no command with name or alias of "%1%"',

  COMMAND_HELP_DESC: 'Show help for a specified command..',
  COMMAND_HELP_USAGE: '[command name]',
  COMMAND_HELP_ALIASES: ['h', 'commands'],
  COMMAND_HELP_HELP: 'Type \`%1%help <command>\` to get more information about a specific command!\n\n**Commands available:**\n%2%',
  COMMAND_HELP_NOT_FOUND: 'This command does not exist.',

  COMMAND_WOF_PLUS: 'The probability of getting %RANGE% or more %UNIT% in %SPIN% spins is %PROB%%.\n',
  COMMAND_WOF_RANGE: 'The probability of getting %RANGE1% to %RANGE2% %UNIT% in %SPIN% spins is %PROB%%',
  COMMAND_WOF_EXACT: 'The probability of getting exactly %RANGE% %UNIT% in %SPIN% spins is %PROB%%.\n%LOG%',
  COMMAND_WOF_EXACT_LOG: '%PROB%% probability of %QTY1%×%X1% + %QTY2%×%X2% %UNIT%\n',
  COMMAND_WOF_MODE: 'With %SPIN% spins, the __mode__ is %N% %UNIT% %PROB%% probability).',
  COMMAND_WOF_VOUCHERS: ['voucher', 'vouchers'],
  COMMAND_WOF_SHARDS: ['hero', 'shards', 'shard'],
  COMMAND_WOF_UNIT_VOUCHERS: 'vouchers',
  COMMAND_WOF_UNIT_SHARDS: 'shards',

  COMMAND_HERO_DESC: 'Information about heroes.',
  COMMAND_HERO_USAGE: 'aly|selene',

  COMMAND_TROOPS_DESC: 'Information about troops.',
  COMMAND_TROOPS_USAGE: '<troops name>',
  COMMAND_TROOPS_BLACKLIST: 'infantry,iron guards,hell jailers,fire mage,viking warrior,scholar,templar knight',
};
