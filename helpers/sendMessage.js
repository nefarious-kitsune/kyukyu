/**
 * Parse command arguments
 * @param {Channel} channel
 * @param {*} content
 * @param {Snowflake} replyTo
 */
async function sendMessage(channel, content, replyTo) {
  const message = await channel.send(content);

  if (channel.type == 'dm') return;

  message
      .react('🗑️')
      .then(() => {
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
                const botId = message.client.user.id;
                await message.reactions.cache.get('🗑️').users.remove(botId);
              }
            })
            .catch(async (collected) => {
              const botId = message.client.user.id;
              await message.reactions.cache.get('🗑️').users.remove(botId);
            });
      })
      .catch(() => {
        err = `Cannot react to message in guild "${message.guild.name}"`;
        console.error(err);
      });
}

exports.sendMessage = sendMessage;
