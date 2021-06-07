/**
 * Parse command arguments
 * @param {object} msg
 * @param {string} emoji
 * @param {function} thenFunction
 */
function safeReact(msg, emoji, thenFunction) {
  if (!msg.guild.me.hasPermission('ADD_REACTIONS')) {
    err = `Cannot add reactions in guild "${msg.guild.name}"`;
    console.error(err);
    return;
  }

  errFunction = () => {
    err = 'Error reacting to message' +
      ` (Guild: "${msg.guild.name}", Channel: "${msg.channel.name}")`;
    console.error(err);
  };

  if (typeof thenFunction == 'function') {
    msg.react(emoji).then(thenFunction).catch(errFunction);
  } else {
    msg.react(emoji).catch(errFunction);
  }
}

exports.safeReact = safeReact;
