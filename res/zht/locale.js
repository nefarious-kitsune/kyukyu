/* eslint-disable max-len */

const path = require('path');

const SPLASH =
`┌───────────────────────────────────────────────────────┐
│                                                       │
│  ─=≡Σ(((^._.^)彡                                     │
│ 鯰魚過時了。狸魚來了...                               │
│                                                       │
└───────────────────────────────────────────────────────┘`;

module.exports = {
  SPLASH: SPLASH,
  EMBED_FOOTER: 'Information contributed by AoW players.',

  NO_INFO: '我沒有關於 %1% 的訊息。',
  NO_COMMENT: '我不予置評！',

  COMMAND_RELOAD_DESC: '重載指令。',
  COMMAND_RELOAD_NOT_FOUND: '沒有名稱或別名是 "%1%" 的指令',

  COMMAND_HELP_DESC: '顯示某特定指令的協助訊息。',
  COMMAND_HELP_USAGE: '[指令名稱]',
  COMMAND_HELP_ALIASES: ['h', 'commands', '幫助'],
  COMMAND_HELP_HELP: '鍵入 \`%PREFIX%help <指令名稱>\` 以取得某指令的相關訊息。\n\n**指令名稱；**\n%COMMANDS%',
  COMMAND_HELP_LABEL_ALIASES: '別名',
  COMMAND_HELP_LABEL_DESC: '敘述',
  COMMAND_HELP_LABEL_USAGE: '使用方法',
  COMMAND_HELP_LABEL_EXAMPLE: '範例',
  COMMAND_HELP_NOT_FOUND: '此指令不存在。',

  COMMAND_WOF_ALIASES: ['wheel', '轉盤'],
  COMMAND_WOF_PLUS: '輪盤共轉 %SPIN% 次時，得到 %RANGE% %UNIT%或以上的的機率是 %PROB%%。',
  COMMAND_WOF_RANGE: '輪盤共轉 %SPIN% 次時，得到 %RANGE1% 到 %RANGE2% %UNIT%的機率是 %PROB%%。',
  COMMAND_WOF_EXACT: '輪盤共轉 %SPIN% 次時，得到正好 %RANGE% %UNIT%的機率是 %PROB%%。\n%LOG%',
  COMMAND_WOF_EXACT_LOG: '%PROB%% 機率得到 %QTY1%×%X1% + %QTY2%×%X2% %UNIT%\n',
  COMMAND_WOF_MODE: '輪盤共轉 %SPIN% 次時的__眾數__是 %N% %UNIT% (%PROB%% 機率)。',
  COMMAND_WOF_VOUCHERS: ['voucher', 'vouchers'],
  COMMAND_WOF_SHARDS: ['hero', 'shards', 'shard', '碎片'],
  COMMAND_WOF_UNIT_VOUCHERS: '張兌換卷',
  COMMAND_WOF_UNIT_SHARDS: '個碎片',

  COMMAND_HERO_DESC: '顯示英雄的相關資訊。',
  COMMAND_HERO_USAGE: '阿狸|賽勒涅',
  COMMAND_HERO_ALIASES: [],
  COMMAND_HERO_MAP: {
    'aly': path.resolve(__dirname, 'heroes', 'aly.json'),
    '阿狸': path.resolve(__dirname, 'heroes', 'aly.json'),
    'selene': path.resolve(__dirname, 'heroes', 'selene.json'),
    '月神': path.resolve(__dirname, 'heroes', 'selene.json'),
    '賽勒涅': path.resolve(__dirname, 'heroes', 'selene.json'),
  },

  COMMAND_TROOPS_DESC: '顯示部隊的相關資訊。',
  COMMAND_TROOPS_USAGE: '<部隊名稱>',
  COMMAND_TROOPS_BLACKLIST: 'infantry,iron guards,hell jailers,fire mage,viking warrior,scholar,templar knight',
};
