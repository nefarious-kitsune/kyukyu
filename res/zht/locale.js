/* eslint-disable max-len */

const fs = require('fs');
const path = require('path');

const SPLASH = fs.readFileSync(path.resolve(__dirname, 'splash.md'), 'utf8');
const GREETING = fs.readFileSync(path.resolve(__dirname, 'greeting.md'), 'utf8');

module.exports = {
  SPLASH: SPLASH,
  GREETING: GREETING,
  EMBED_FOOTER: '資訊由AoW玩家提供。',

  COMMAND_STATS_DESC: '顯示士兵數據。',
  COMMAND_STATS_USAGE: '<士兵名稱1> [星級1] <士兵名稱2> [星級2]...',
  COMMAND_STATS_USAGE_EXAMPLE: '弓箭手 9 冰霜弓箭手 8',
  COMMAND_STATS_ALIASES: ['stat', '數據'],
  COMMAND_STATS_HEADER: '{LEVEL}星{TROOPS}',
  COMMAND_STATS_BASIC_HEADER: '基礎屬性',
  COMMAND_STATS_SKILL_HEADER: '技能',
  COMMAND_STATS_DM: '士兵數據已私訊。',
  COMMAND_STATS_LABELS: {
    'race': '種族',
    'human': '人族',
    'dark': '暗影族',
    'wild': '獸族',
    'sacred': '聖族',
    'count': '數量',
    'health': '生命',
    'attack': '攻擊',
    'defense': '防禦',
    'speed': '移動速度',
    'attack_speed': '攻速',
    'attack_distance': '攻擊距離',
    'shooting_range': '射程',
    'attack_type': '攻擊類型',
    'damage_type': '傷害類型',
    'damage_shape': '傷害範圍形狀',
    'damage_range': '傷害範圍',
    // speed
    'very slow': '很慢',
    'slow': '慢',
    'medium': '中等',
    'fast': '快',
    'very fast': '很快',
    // attack/shooting range
    'short': '近',
    'long': '遠',
    'infinity': '無窮',
    // attack type
    'ranged': '遠程',
    'melee': '近戰',
    // damage type
    'physical': '物理',
    'magical': '魔法',
    // damage shape
    'single': '單體',
    'puncture': '穿刺',
    'rounded': '圓形',
    'rectangular': '矩形',
    'range': '範圍',
    'trigger_number': '觸發所需攻擊次數',
    'duration': '持續時間',
    'duration_2': '持續時間',
    'damage': '傷害',
    'lasting_damage': '持續傷害',
    'attack_increase': '攻擊加成',
    'attack_reduction': '攻擊降低',
    'attack_speed_increase': '攻擊速度加成',
    'attack_speed_reduction': '攻擊速度降低',
    'movement_speed_increase': '移動速度加成',
    'movement_speed_reduction': '移動速度降低',
    'knockback_distance': '擊退距離',
    'heal': '治療',
    'number_of_fireballs': '分裂出的火球數量',
    'life_steal_percentage': '吸血百分比',
    'damage_resistance': '傷害減免',
    'critical_rate': '爆擊概率',
    'critical_damage_rate': '爆擊傷害',
    'damage_reflection': '傷害反彈',
  },

  NO_INFO: '我沒有關於「{TEXT}」的訊息。',
  NO_COMMENT: '我不予置評！',

  TROOPS_ALIASES: [
    // first item is the correct spelling, the rest alternate spellings
    ['meta'],
    ['infantry', '步兵'],
    ['archers', 'archer'],
    ['iron guards', 'iron guard', '鐵衛'],
    ['hell jailers', 'hell jailer', '獄卒'],
    ['bomber'],
    ['catapult', 'cat'],
    ['fire mage', 'fm', '火法師'],
    ['bandits', 'bandit'],
    ['ogre warrior', 'ogre'],
    ['ghost assassins', 'ghost assassin', 'ga'],
    ['magic apprentice', 'apprentice', 'ma'],
    ['viking warrior', '維京武士'],
    ['ice mage', 'im', '寒冰法師'],
    ['scholar', '學者'],
    ['inquisitor', 'inquisitors', 'inq', '聖教徒'],
    ['undead soldier', 'undead soldiers', 'undead', '夜魔衛兵', '夜魔'],
    ['harbinger of fire', 'harbingers of fire', 'hof', '聖火法師'],
    ['paladin', 'paladins', '神盾兵'],
    ['ballista'],
    ['goblikazes', 'goblikaze', 'kazes'],
    ['cactuses', 'cactus', 'cacti'],
    ['necromancer', 'necro'],
    ['skeleton', 'skeleton'],
    ['pilgrims', 'pilgrim', '巡禮者'],
    ['yasha'],
    ['priest mage', 'pm'],
    ['soul hunter', 'sh'],
    ['templar knight', 'tk'],
    ['peltasts', 'peltast', 'pelts', 'pelt', '投茅者'],
    ['brawlers', 'brawler', '爭鬥者'],
    ['taurus witcher', 'taurus witchers', 'tw', '牛角巫師'],
    ['voodoo dolls', 'voodoo doll', 'voodoo', '巫毒娃娃', '巫毒'],
    ['pumpkin guard', 'pg', '南瓜守衛'],
    ['dark witch', 'dw', '黑魔女'],
    ['nun', 'nuns', '修女'],
    ['pirate ship', 'ps', '海盜船'],
    ['pirate', 'pirates', '海盜'],
    ['demon'],
    ['beast master', 'bm'],
    ['the beast partner', '熊', '野獸', '最好的搭檔'],
    ['witchcraft totem', 'wt', '巫術圖騰'],
    ['meteor golem', 'mg', '幽靈隕石', '隕石'],
    ['frost archers', 'frost archer', 'fa', 'fas', '冰霜弓箭手', '冰弓'],
    ['sacred swordsman', 'ss', 'swordsman', '聖殿劍士'],
    ['rhino knight', 'rk', '犀牛騎士', '犀牛'],
    ['pharaoh', '法老'],
    ['stone golem', 'sg', '岩石巨人', '岩石'],
  ],

  TROOPS_DISPLAY_NAMES: {
    'meta': 'meta',
    'infantry': '步兵',
    'infantry': 'Infantry',
    'archers': 'Archers',
    'iron guards': '鐵衛',
    'bomber': 'Bomber',
    'catapult': 'Catapult',
    'hell jailers': '獄卒',
    'fire mage': '火法師',
    'bandits': 'Bandits',
    'ogre warrior': 'Ogre Warrior',
    'ghost assassins': 'Ghost Assassins',
    'magic apprentice': 'Magic Apprentice',
    'viking warrior': '維京武士',
    'ice mage': '寒冰法師',
    'scholar': '學者',
    'inquisitor': '聖教徒',
    'undead soldier': '夜魔衛兵',
    'harbinger of fire': '聖火法師',
    'paladin': '神盾兵',
    'ballista': 'Ballista',
    'goblikazes': '自爆哥布林',
    'cactuses': 'Cactuses',
    'necromancer': 'Necromancer',
    'skeleton': 'Skeleton',
    'pilgrims': '巡禮者',
    'yasha': 'Yasha',
    'priest mage': '聖術士',
    'soul hunter': 'Soul Hunter',
    'templar knight': 'Templar Knight',
    'peltasts': '投茅者',
    'brawlers': '爭鬥者',
    'taurus witcher': '牛角巫師',
    'voodoo dolls': '巫毒娃娃',
    'pumpkin guard': '南瓜守衛',
    'dark witch': '黑魔女',
    'nun': '修女',
    'pirate ship': '海盜船',
    'pirate': '海盜',
    'demon': 'Demon',
    'beast master': 'Beast Master',
    'the beast partner': 'The Beast Partner',
    'witchcraft totem': '巫術圖騰',
    'meteor golem': '幽靈隕石',
    'frost archers': '冰霜弓箭手',
    'sacred swordsman': 'Sacred Swordsman',
    'rhino knight': 'Rhino Knight',
    'pharaoh': 'Pharaoh',
    'stone golem': '岩石巨人',
  },

  HERO_ALIASES: [
    // first item is the correct spelling, the rest alternate spellings
    ['meta'],
    ['kelvins'],
    ['illum'],
    ['moshe'],
    ['hohenheim', 'hoh'],
    ['planck'],
    ['drake'],
    ['edward', 'black beard'],
    ['ivan'],
    ['harrison', 'clockman'],
    ['kriss', 'santa'],
    ['ainz'],
    ['robin hood', 'robin', 'hood'],
    ['apollo'],
    ['poseidon', 'pos'],
    ['azrael', 'grim reaper', 'reaper'],
    ['dante'],
    ['selene'],
    ['wukong', 'monkey king'],
    ['davison', 'davi'],
    ['minotaur'],
    ['green'],
    ['seondeok', 'seon'],
    ['cassandra'],
    ['miller'],
    ['genichiro', 'sakura blade'],
    ['zeus'],
    ['dracula', 'drac'],
    ['chione', '齊昂妮', '冰女'],
    ['nezha'],
    ['mephisto', 'meph'],
    ['horus'],
    ['arthur'],
    ['beowulf'],
    ['athena'],
    ['odin'],
    ['aly', 'nine-tail'],
    ['kraken'],
    ['jinn'],
  ],

  COMMAND_RELOAD_DESC: '重載指令。',
  COMMAND_RELOAD_NOT_FOUND: '沒有名稱或別名是「{TEXT}」的指令',
  COMMAND_CLEAR_DESC: '（限定DM）刪除機器人的訊息（最多十筆）。',
  COMMAND_CLEAR_ALIASES: [],
  COMMAND_HELP_DESC: '顯示某特定指令的協助訊息。',
  COMMAND_HELP_USAGE: '[指令名稱]',
  COMMAND_HELP_ALIASES: ['h', 'commands', '幫助'],
  COMMAND_HELP_HELP: '鍵入\`{PREFIX}help <指令名稱>\`以取得某指令的相關訊息。\n\n**指令名稱；**\n{COMMANDS}',
  COMMAND_HELP_LABEL_ALIASES: '別名',
  COMMAND_HELP_LABEL_DESC: '敘述',
  COMMAND_HELP_LABEL_USAGE: '使用方法',
  COMMAND_HELP_LABEL_EXAMPLE: '範例',
  COMMAND_HELP_NOT_FOUND: '此指令不存在。',

  COMMAND_BUILDING_DESC: '關於軍營建設的秘訣',
  COMMAND_BUILDING_ALIASES: ['軍營'],
  COMMAND_BUILDING_FILES: [
    path.resolve(__dirname, 'building', 'building1.json'),
    path.resolve(__dirname, 'building', 'building2.json'),
    path.resolve(__dirname, 'building', 'building3.json'),
  ],

  COMMAND_FORMATION_DESC: '軍隊陣形的訣竅',
  COMMAND_FORMATION_USAGE: '基本|破關|刷金',
  COMMAND_FORMATION_ALIASES: ['form', '陣形'],
  COMMAND_FORMATION_MAP: {
    // 'beginner': path.resolve(__dirname, 'formation', 'beginner.json'),
    // 'basic': path.resolve(__dirname, 'formation', 'beginner.json'),
    // '基本': path.resolve(__dirname, 'formation', 'beginner.json'),
    // 'level': path.resolve(__dirname, 'formation', 'leveling.json'),
    // 'leveling': path.resolve(__dirname, 'formation', 'leveling.json'),
    // '破關': path.resolve(__dirname, 'formation', 'leveling.json'),
    '8k': path.resolve(__dirname, 'formation', '8k.json'),
    '8000': path.resolve(__dirname, 'formation', '8k.json'),
    'farming': path.resolve(__dirname, 'formation', '8k.json'),
    '刷金': path.resolve(__dirname, 'formation', '8k.json'),
  },

  COMMAND_TROPHIES_DESC: '計算對戰後的預期的獎盃增減。',
  COMMAND_TROPHIES_USAGE: '<你的獎盃數量> <你的獎盃數量>',
  COMMAND_TROPHIES_USAGE_EXAMPLE: '3600 3800',
  COMMAND_TROPHIES_ALIASES: ['trophy', 'score', 'scores', '獎盃', '計分'],
  COMMAND_TROPHIES_RESULT: '勝利：**{GAIN}**分，失敗：**{LOSS}**分',

  COMMAND_WOF_ALIASES: ['wheel', '轉盤'],
  COMMAND_WOF_PLUS: '輪盤共轉{SPIN_COUNT}次時，得到{HIT_RANGE}{UNIT}或以上的的機率是{PROB}%。',
  COMMAND_WOF_RANGE: '輪盤共轉{SPIN_COUNT}次時，得到{HIT_RANGE_1}到{HIT_RANGE_2}{UNIT}的機率是{PROB}%。',
  COMMAND_WOF_EXACT: '輪盤共轉{SPIN_COUNT}次時，得到正好{HIT_RANGE}{UNIT}的機率是{PROB}%。\n{LOG}',
  COMMAND_WOF_EXACT_LOG: '{PROB}%機率得到{HIT_1}×{QTY_1}+{HIT_2}×{QTY_2}{UNIT}\n',
  COMMAND_WOF_MODE: '輪盤共轉{SPIN_COUNT}次時的__眾數__是{TOTAL_QTY}{UNIT}({PROB}% 機率)。',
  COMMAND_WOF_VOUCHERS: ['voucher', 'vouchers'],
  COMMAND_WOF_SHARDS: ['hero', 'shards', 'shard', '碎片'],
  COMMAND_WOF_UNIT_VOUCHERS: '張兌換卷',
  COMMAND_WOF_UNIT_SHARDS: '個碎片',

  COMMAND_AOE_DESC: '顯示士兵或是英雄的AoE範圍的參考圖。',
  COMMAND_AOE_USAGE: '<士兵名稱|英雄名稱>',
  COMMAND_AOE_USAGE_EXAMPLE: '齊昂妮',
  COMMAND_AOE_ALIASES: ['範圍'],

  COMMAND_HERO_DESC: '顯示英雄的相關資訊。',
  COMMAND_HERO_USAGE: '阿狸|賽勒涅',
  COMMAND_HERO_ALIASES: ['英雄'],
  COMMAND_HERO_MAP: {
    'meta': path.resolve(__dirname, 'heroes', 'meta.json'),
    'aly': path.resolve(__dirname, 'heroes', 'aly.json'),
    'selene': path.resolve(__dirname, 'heroes', 'selene.json'),
    'chione': path.resolve(__dirname, 'heroes', 'chione.json'),
  },

  COMMAND_TROOPS_DESC: '顯示部隊的相關資訊。',
  COMMAND_TROOPS_USAGE: '<部隊名稱>',
  COMMAND_TROOPS_ALIASES: ['士兵', '部隊'],
  COMMAND_TROOPS_BLACKLIST: 'infantry,iron guards,hell jailers,fire mage,viking warrior,scholar,templar knight',
  COMMAND_TROOPS_FILES: {
    'paladin': path.resolve(__dirname, 'troops', 'paladin.json'),
    'pilgrims': path.resolve(__dirname, 'troops', 'pilgrims.json'),
    'brawlers': path.resolve(__dirname, 'troops', 'brawlers.json'),
    'nun': path.resolve(__dirname, 'troops', 'nun.json'),
    'voodoo dolls': path.resolve(__dirname, 'troops', 'voodoo dolls.json'),
  },

  COMMAND_CURSE_DESC: '計算詛咒對敵方部隊的效能。',
  COMMAND_CURSE_USAGE: '<目標> [目標等級] [詛咒者] [詛咒者等級]',
  COMMAND_CURSE_USAGE_EXAMPLE: '\'岩石巨人\' 9 巫毒 8',
  COMMAND_CURSE_ALIASES: ['詛咒'],
  COMMAND_CURSE_VOODOO_CANNOT_BE_CURSED: '巫毒娃娃不能夠詛咒另一個巫毒娃娃。',
  COMMAND_CURSE_VOODOO: '詛咒者：巫毒娃娃（{VOODOO LEVEL}級）\n目標：{TARGET}（{TARGET LEVEL}級）\n詛咒成功率：{RATE}%\n最高傷害：{DAMAGE}（目標最高生命的{HEALTH PERCENTAGE}%）',

  COMMAND_PLUS_SEONDEOK_DESC: '計算善德對友軍的效能。',
  COMMAND_PLUS_SEONDEOK_USAGE: '[英雄等級] <部隊> [部隊等級]',
  COMMAND_PLUS_SEONDEOK_USAGE_EXAMPLE: '15 夜魔衛兵 9',
  COMMAND_PLUS_SEONDEOK_ALIASES: ['+seon', '+善德'],
  COMMAND_PLUS_SEONDEOK_INTRO: '當等級{TROOPS LEVEL}的{TROOPS}搭配等級{HERO LEVEL}的善德時，其效果如下。\n\n',
  COMMAND_PLUS_SEONDEOK_OPENING: '**8秒開局加成**\n',
  COMMAND_PLUS_SEONDEOK_OPENING_DMG: '傷害 = ({ATTACK} - 敵方護甲) + {ADD DAMAGE}\n  （等同約{EQUIV INCREASE}%攻擊加成）\n',
  COMMAND_PLUS_SEONDEOK_OPENING_AOE: '群傷半徑：{AOE RADIUS}（面積 {AOE AREA}）\n群傷：{AOE ATTACK}\n',
  COMMAND_PLUS_SEONDEOK_NORMAL: '\n**普通攻擊** (原始值)\n',
  COMMAND_PLUS_SEONDEOK_NORMAL_ATTACK: '攻擊：{ATTACK}\n',
  COMMAND_PLUS_SEONDEOK_NORMAL_CIRCLE: '群傷半徑：{AOE RADIUS}（面積 {AOE AREA}）\n',
  COMMAND_PLUS_SEONDEOK_NORMAL_RECT: '群傷範圍：{AOE W}×{AOE L}（面積 {AOE AREA}）\n',

  COMMAND_PLUS_SELENE_DESC: '計算賽勒涅對友軍的效能。',
  COMMAND_PLUS_SELENE_USAGE: '[英雄等級] <部隊> [部隊等級]',
  COMMAND_PLUS_SELENE_USAGE_EXAMPLE: '15 夜魔衛兵 9',
  COMMAND_PLUS_SELENE_ALIASES: ['+賽勒涅', '+月神'],
  COMMAND_PLUS_SELENE_INTRO: '當等級{TROOPS LEVEL}的{TROOPS}搭配等級{HERO LEVEL}的賽勒涅時，其效果如下。\n\n',
  COMMAND_PLUS_SELENE_OPENING: '**{DURATION}秒開局加成**\n',
  COMMAND_PLUS_SELENE_OPENING_ATK: '攻擊：{ATTACK}（{INCREASE}%加成）\n',
  COMMAND_PLUS_SELENE_OPENING_CURSED: '一個9級巫毒娃娃可造成的最高傷害：{DAMAGE}（最高生命的{HEALTH PERCENTAGE}%）\n',

  COMMAND_PLUS_ARTHUR_DESC: '計算亞瑟對友軍的效能。',
  COMMAND_PLUS_ARTHUR_USAGE: '[英雄等級] <部隊> [部隊等級]',
  COMMAND_PLUS_ARTHUR_USAGE_EXAMPLE: '15 投茅者 9',
  COMMAND_PLUS_ARTHUR_ALIASES: ['+亞瑟'],
  COMMAND_PLUS_ARTHUR_INTRO: '當等級{TROOPS LEVEL}的{TROOPS}搭配等級{HERO LEVEL}的亞瑟時，其效果如下。\n\n',
  COMMAND_PLUS_ARTHUR_PASSIVE: '免傷：{IMMUNITY PERCENTAGE}%\n生命值恢復：每秒{HEALTH REGEN}\n',
  COMMAND_PLUS_ARTHUR_OPENING_CURSED: '一個9級巫毒娃娃可造成的最高傷害：{DAMAGE}（最高生命的{HEALTH PERCENTAGE}%）\n',
  COMMAND_PLUS_ARTHUR_NOT_HUMAN: '無效果。亞瑟的能力只對人族部隊有效。\n',
};
