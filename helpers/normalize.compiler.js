const fs = require('fs');

// Code copied from MDN
/**
 * Get whole character at i
 * @param {string} str string
 * @param {number} i index
 * @return {[string, number]}
 */
function getWholeCharAndI(str, i) {
  const charCode = str.charCodeAt(i);
  if (Number.isNaN(charCode)) return ''; // Position not found
  if (charCode < 0xD800 || charCode > 0xDFFF) {
    return [str.charAt(i), i]; // Normal character, keeping 'i' the same
  }

  // High surrogate (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if ((0xD800 <= charCode) && (charCode <= 0xDBFF)) {
    if (str.length <= (i + 1)) {
      throw new Error('High surrogate without following low surrogate');
    }
    const next = str.charCodeAt(i + 1);
    if (0xDC00 > next || next > 0xDFFF) {
      throw new Error('High surrogate without following low surrogate');
    }
    return [str.charAt(i) + str.charAt(i + 1), i + 1];
  }

  // Low surrogate (0xDC00 <= charCode && charCode <= 0xDFFF)
  if (i === 0) {
    throw new Error('Low surrogate without preceding high surrogate');
  }

  const prev = str.charCodeAt(i - 1);

  // (could change last hex to 0xDB7F to treat high private surrogates
  // as single characters)
  if (0xD800 > prev || prev > 0xDBFF) {
    throw new Error('Low surrogate without preceding high surrogate');
  }

  // Return the next character instead (and increment)
  return [str.charAt(i + 1), i + 1];
}

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const FANCY = `𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷
𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟
𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃
𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏
𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫
𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻
𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯
𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣
ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ
🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉
ᗩᗷᑕᗪᗴᖴǤᕼᎥᒎᛕᒪᗰᑎᗝᑭɊᖇᔕ丅ᑌᐯᗯ᙭Ƴ乙ᗩᗷᑕᗪᗴᖴǤᕼᎥᒎᛕᒪᗰᑎᗝᑭɊᖇᔕ丅ᑌᐯᗯ᙭Ƴ乙
ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ
𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳
ABCDEFGHIJKLMNOPQRSTUVWXYZɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz
🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉`.split('\n');

// ƹʏxwvuƚꙅɿpqoᴎm|ʞꞁiʜǫᎸɘbɔdɒƸYXWVUTꙄЯỌꟼOͶM⅃⋊ႱIHᎮꟻƎᗡƆᙠA
// zʎxʍʌnʇsɹbdouɯlʞɾıɥɓɟǝpɔqɐZ⅄XMΛ∩⊥SᴚΌԀONW˥⋊ſIH⅁ℲƎᗡƆᙠ∀

const testers = [];
const replacers = [];

pad = (padding, str) => ' '.repeat(padding) + str;
padLines = (padding, lines) => lines.map((s)=>pad(padding, s));

for (let fi=0; fi<FANCY.length; fi++) {
  const fancy = FANCY[fi];
  let code = '(source) => source';
  let charSet = '';
  for (let i=0, j=0; i < fancy.length; i++, j++) {
    [char, i] = getWholeCharAndI(fancy, i);
    if ((charSet.indexOf(char) == -1) && (alphabets.indexOf(char) == -1)) {
      charSet += char;
      code += `.replaceAll('${char}', '${alphabets.charAt(j)}')`;
    }
  }
  testers.push(charSet);
  replacers.push(code + ',');
}

const replacerCode = padLines(2, replacers);
replacerCode.unshift('const replacers = [');
replacerCode.push('];');

const testerCode = padLines(2, testers.map((set) => `/[${set}]/gu,`));
testerCode.unshift('const testers = [');
testerCode.push('];');

const compiledCode =
'/* eslint-disable max-len */\n\n' +
replacerCode.join('\n') + '\n' +
testerCode.join('\n') + '\n' +
`const normalize = (source) => {
  for (let i=0; i < testers.length; i++) {
    let fancyCount = 0;
    while (testers[i].exec(source)) fancyCount++;
    testers[i].lastIndex = 0;
    if (fancyCount > 3) {
      // console.log('TESTED POSITIVE: ' + i);
      return replacers[i].call(null, source);
    }
  }
  return source;
};

// TEST
// console.log(normalize('Test 𝒜𝐵𝒞𝒟'));

exports.normalize = normalize;
`;

fs.writeFileSync('normalize.js', compiledCode);
