/**
 * Parse command arguments
 * @param {number} value
 * @param {number} decimals Maximum number of decimal digits
 * @return {string}
 */
function formatNumber(value, decimals) {
  let s = Number(value).toFixed(decimals);
  if (decimals > 0) {
    while (s.endsWith('0')) {
      s = s.slice(0, s.length - 1);
    }
    if (s.endsWith('.')) {
      s = s.slice(0, s.length - 1);
    }
  }
  return s;
}

exports.formatNumber = formatNumber;
