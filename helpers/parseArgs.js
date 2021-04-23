/**
 * Parse command arguments
 * @param {string} prefix
 * @param {string} text
 * @return {object}
 */
function parseArgs(prefix, text) {
  let token = '';
  let idxStart = prefix.length;
  let idxEnd = idxStart;

  /**
   * Get next token.
   * Return true if the token is not the last
   * Retrun false if the token is the last or if there is an error
   * @return {boolean}
   */
  function getToken() {
    token = '';

    let closer = undefined;
    let chr = text.charAt(idxStart);
    if (chr == '\'') {
      closer = '\'';
      idxStart++;
    } else if (chr == '\"') {
      closer = '\"';
      idxStart++;
    } else if (chr == '‘') { // blah, iOS keypad
      closer = '’';
      idxStart++;
    } else if (chr == '“') { // blah, iOS keypad
      closer = '”';
      idxStart++;
    }

    idxEnd = idxStart;

    while (idxEnd < text.length) {
      chr = text.charAt(idxEnd);

      if (closer) {
        if (chr != closer) {
          // Not closed
          if ((chr == '\n') || (chr == '\r')) {
            token = '';
            return false;
          }
        } else {
          // Closed
          if ((idxEnd+1 >= text.length) ||
            (text.charAt(idxEnd+1) == '\n')) {
            // End of line
            token = text.substring(idxStart, idxEnd);
            return false;
          } else if (text.charAt(idxEnd+1) != ' ') {
            // Error: end quote not followed by a space
            token = '';
            return false;
          } else {
            // Not end of line. Find the next non-space character
            token = text.substring(idxStart, idxEnd);
            idxStart = idxEnd + 1;
            while ((idxStart < text.length) && (text.charAt(idxStart) == ' ')) {
              idxStart++;
            }
            return (
              (idxStart < text.length) &&
              (text.charAt(idxStart) != '\n') &&
              (text.charAt(idxStart) != '\r')
            );
          }
        } // if (closer)
      } else {
        // closer == undefined
        if (chr == ' ') {
          token = text.substring(idxStart, idxEnd);
          idxStart = idxEnd + 1;
          while ((idxStart < text.length) && (text.charAt(idxStart) == ' ')) {
            idxStart++;
          }
          return (
            (idxStart < text.length) &&
            (text.charAt(idxStart) != '\n') &&
            (text.charAt(idxStart) != '\r')
          );
        } else if ((chr == '\n') || (chr == '\r')) {
          token = text.substring(idxStart, idxEnd);
          return false;
        }
      }
      idxEnd++;
    }

    // We have reached end of string
    if (closer) {
      token = '';
    } else {
      token = text.substring(idxStart, idxEnd);
    }
    return false;
  }

  const args = [];

  while (getToken()) {
    args.push(token);
  }
  if (token.length > 0) args.push(token);
  return args;
}

exports.parseArgs = parseArgs;
