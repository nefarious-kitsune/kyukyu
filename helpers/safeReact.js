/**
 * Parse command arguments
 * @param {object} msg
 * @param {string} emoji
 * @param {function} onSuccess
 * @param {function} onError
 */
function safeReact(msg, emoji, onSuccess, onError) {
  const errorMessage = `Cannot add reaction in guild "${msg.guild.name}"`;
  const error =
    (typeof onError == 'function')?
    onError:
    () => console.error(errorMessage);

  if (!msg.channel.permissionsFor(msg.client.user.id).has('ADD_REACTIONS')) {
    error();
    return;
  }

  if (typeof onSuccess == 'function') {
    msg.react(emoji).then(onSuccess).catch(error);
  } else {
    msg.react(emoji).catch(error);
  }
}

exports.safeReact = safeReact;
