/**
 * Parse command arguments
 * @param {Channel} channel
 * @param {*} content
 * @param {Snowflake} replyTo
 */
async function sendMessage(channel, content, replyTo) {
  const message = await channel.send(content);

  message.react('🗑️');

  const filter = (reaction, user) => {
    return (('🗑️' === reaction.emoji.name) && (user.id === replyTo));
  };

  message
      .awaitReactions(filter, {max: 1, time: 60000})
      .then(async (collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === '🗑️') {
          await message.delete();
        }
      })
      .catch(async (collected) => {
        const botId = message.client.user.id;
        const userReactions =
          message.reactions.cache
              .filter(
                  (reaction) => reaction.users.cache.has(botId),
              );
        try {
          for (const reaction of userReactions.values()) {
            await reaction.users.remove(botId);
          }
        } catch (error) {
          console.error('Failed to remove reactions.');
        }
      });
}

exports.sendMessage = sendMessage;
