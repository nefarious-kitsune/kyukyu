const {pause} = require('./en.common');

/* eslint-disable max-len */
const RING_IMG_URL = 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';
const RING_EMOJI = '<:the_one_ring:906177472490532864>';
/* eslint-enable max-len */

const JOIN = 'JOIN';

const WELCOME = {
  content:
    'Welcome! We\'re still waiting for others to sign up. ' +
    'The contest will start shortly.',
  // content:
  //   '歡迎。我們還在等其他人加入。賭注很快地就會開始。.',
  ephemeral: true,
};

// const JOIN = '加入';
// const ANNOUNCEMENT_MSG =
//   '一場荒謬的賭注（**Ri**diculously **N**onsensical **G**ambits, RiNGs）' +
//   `即將開始！你準備好了嗎？\n\n如果您想參與其中，請點擊“${JOIN}”按鈕！\n` +
//   `• 進入時間限制：**${ENTRY_TIME_LIMIT}**秒\n` +
//   `• 最多**${PLAYER_LIMIT}**名參與者\n` +
//   `• 最多**${WINNER_LIMIT}**名獲勝者\n\n` +
//   '這場比賽的獲勝者將被加冕為**Lord of RiNGs**!';

/* eslint-disable max-len */
module.exports = {
  enroll(GAME_SETTINGS, master) {
    const ANNOUNCEMENT_MSG =
    'A round of **Ri**diculously **N**onsensical **G**ambits (RiNGs) ' +
    'is about to start! Are you ready?\n\n' +
    `If you want to participate in it, tap the ${JOIN} button!\n` +
    `• Entry time limit: **${GAME_SETTINGS.ENTRY_TIME_LIMIT}** seconds\n` +
    `• Max **${GAME_SETTINGS.PLAYER_LIMIT}** participants\n` +
    `• Max **${GAME_SETTINGS.WINNER_LIMIT}** winners\n\n` +
    'Winners of this game will be crowned as **Lord of the RiNGs**!\n\n' +
    'Alright! Let\'s go!';

    const ANNOUNCEMENT = {
      embeds: [{
        title: 'RiNGs', thumbnail: {url: RING_IMG_URL},
        description: ANNOUNCEMENT_MSG, color: 0x3170a6,
      }],
      components: [{
        type: 1,
        components: [{
          type: 2, label: JOIN,
          style: 2, custom_id: 'join',
          emoji: RING_EMOJI,
        }],
      }],
    };

    const ANNOUNCEMENT_CLOSED = {
      embeds: [{
        title: 'RiNGs', thumbnail: {url: RING_IMG_URL},
        description: ANNOUNCEMENT_MSG, color: 0x3170a6,
      }],
      components: [{
        type: 1,
        components: [{
          type: 2, label: JOIN,
          style: 2, custom_id: 'join',
          emoji: RING_EMOJI, disabled: true,
        }],
      }],
    };

    master.channel
        .send(ANNOUNCEMENT)
        .then((msg)=> {
          const contestantIds = [];
          const collector = msg.createMessageComponentCollector({
            time: GAME_SETTINGS.ENTRY_TIME_LIMIT * 1000,
            componentType: 'BUTTON',
          });
          collector.on('collect',
              (interaction) => {
                interaction.deferUpdate();
                if (contestantIds.indexOf(interaction.member.id) != -1) return;
                const newPlayer = master.addPlayer(interaction);
                interaction.followUp(WELCOME);
                console.log(`${newPlayer.playerName} has joined the RiNGs.`);

                contestantIds.push(interaction.member.id);
                if (master.players.length ==3) {
                  master.players[0].medal = 1;
                  master.players[1].medal = 1;
                  master.players[2].medal = 1;
                  master.channel.send(
                      `**${master.players[0].playerName}**, ` +
                      `**${master.players[1].playerName}**, and ` +
                      `**${master.players[2].playerName}** ` +
                      'have taken a headstart! ' +
                      'They each will be awarded an Honor Medal.',
                  );
                }
                if (master.players.length >= GAME_SETTINGS.PLAYER_LIMIT) {
                  collector.stop();
                }
              },
          );
          collector.on('end', (collected) => {
            msg.edit(ANNOUNCEMENT_CLOSED);
            master.channel.send(
                '**RiNGs** has started! Best of luck to all of our ' +
                `**${master.players.length}** players.`);
            // channel.send(
            //     '荒謬的賭注開始了！祝我們' +
            //     `**${master.players.length}**名玩家玩得愉快！`);
            pause(GAME_SETTINGS.PAUSE_BEFORE_GAME_START)
                .then(() => master.startDay());
          });
        });
  },
};
