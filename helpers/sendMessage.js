const {safeReact} = require('./safeReact');

/**
 * Parse command arguments
 * @param {Channel} channel
 * @param {*} content
 * @param {Snowflake} replyTo
 */
async function sendMessage(channel, content, replyTo) {
  const message = await channel.send(content);

  if (channel.type == 'dm') return;

  removeBin = () => {
    message.reactions.cache.get('🗑️').users
        .remove(message.client.user.id)
        .catch(() => {
          console.error(
              `Cannot remove reactions in guild "${message.guild.name}"`,
          );
        });
  };

  safeReact(
      message,
      '🗑️',
      () => {
        const filter = (reaction, user) => {
          return (('🗑️' === reaction.emoji.name) && (user.id === replyTo));
        };

        message
            .awaitReactions(filter, {max: 1, time: 60000})
            .then(async (collected) => {
              const reaction = collected.first();
              if ((reaction) && (reaction.emoji.name === '🗑️')) {
                await message.delete();
              } else {
                removeBin();
              }
            })
            .catch(async (collected) => {
              removeBin();
            });
      },
  );
}

exports.sendMessage = sendMessage;
