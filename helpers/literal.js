/**
 * Parse command arguments
 * @param {string} template
 * @param {[string]} strings
 * @return {string}
 */
function literal(template, ...strings) {
  let s = template;
  const str = [].slice.call(strings);
  for (let i = 0; i < str.length; i=i+2) {
    if (typeof s.replaceAll == 'function') {
      s = s.replaceAll(str[i], str[i+1]);
    } else {
      reg = new RegExp(str[i], 'g');
      s = s.replace(reg, str[i+1]);
    }
  }
  return s;
}

exports.literal = literal;
