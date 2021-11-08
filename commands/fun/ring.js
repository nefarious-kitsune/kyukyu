// const {literal} = require('../../helpers/literal');

const {
  SCENARIO_TYPE, RESOLUTION_TYPE,
  survived, eliminated, medalX1, medalX2, medalX3,
  diceRoll, pause,
} = require('res/en.common');

const SCENARIOS = require('res/en.chance').concat(require('res/en.danger'));

const GAME_CHANNELS = ['903150247142903878', '831064145637539860'];

/* eslint-disable max-len */
const RING_IMG_URL = 'https://cdn.discordapp.com/attachments/833978786395586600/903096090977509446/the-ring.png';
/* eslint-enable max-len */

// Debug
// const PAUSE_BEFORE_GAME_START = 0.5;
// const RESPONSE_TIME = 15;
// const PAUSE_AFTER_DAY_ENDS = 1;
// const ENTRY_TIME_LIMIT = 10;
// const PLAYER_LIMIT = 20;
// const WINNER_LIMIT = -1;

// Production
const PAUSE_BEFORE_GAME_START = 1;
const RESPONSE_TIME = 25;
const PAUSE_AFTER_DAY_ENDS = 15;
const ENTRY_TIME_LIMIT = 90;
const PLAYER_LIMIT = 25;
const WINNER_LIMIT = 2;

const SPECIAL_TRIGGER = 6;

const ENTROLL_FILTER = {
  time: ENTRY_TIME_LIMIT * 1000,
  componentType: 'BUTTON',
};
const RESPONSE_FILTER = {
  max: 1,
  time: RESPONSE_TIME * 1000,
  componentType: 'BUTTON',
};
// const DUEL_RESPONSE_TIME = 18;
// const DUEL_RESPONSE_FILTER = {max: 1, time: DUEL_RESPONSE_TIME * 1000};

const BLUE = 0x3170a6; // (49, 112, 166)
// const RED = 0xb83a34; // (184, 58, 52)
// const GREEN = 0x77993c; // (119, 153, 60)

const RING_MASTER_REVIVE_RATE = 0.08;

const MAX_MEDAL = 5; // maximum number of medals a player can have.

const REVIVE_MSG = '\n\nYou were **revived** with an Honor Medal.';
const MASTER_REVIVE_MSG = '\n\nYou were **revived** by the RiNG Master!';
const DEATH_MSG = '\n\n**You did not make it. Better luck next time.**';

const JOIN = 'JOIN';
const ANNOUNCEMENT_MSG =
'A round of **Ri**diculously **N**onsensical **G**ambits (RiNGs) ' +
'is about to start! Are you ready?\n\n' +
`If you want to participate in it, tap the ${JOIN} button!\n` +
`• Entry time limit: **${ENTRY_TIME_LIMIT}** seconds\n` +
`• Max **${PLAYER_LIMIT}** participants\n` +
`• Max **${WINNER_LIMIT}** winners\n\n` +
'Winners of this game will be crowned as **Lord of the RiNGs**!\n\n' +
'Alright! Let\'s go!';

// const JOIN = '加入';
// const ANNOUNCEMENT_MSG =
//   '一場荒謬的賭注（**Ri**diculously **N**onsensical **G**ambits, RiNGs）' +
//   `即將開始！你準備好了嗎？\n\n如果您想參與其中，請點擊“${JOIN}”按鈕！\n` +
//   `• 進入時間限制：**${ENTRY_TIME_LIMIT}**秒\n` +
//   `• 最多**${PLAYER_LIMIT}**名參與者\n` +
//   `• 最多**${WINNER_LIMIT}**名獲勝者\n\n` +
//   '這場比賽的獲勝者將被加冕為**Lord of RiNGs**!';

const ANNOUNCEMENT = {
  embeds: [{
    title: 'RiNGs',
    thumbnail: {url: RING_IMG_URL},
    description: ANNOUNCEMENT_MSG,
    color: BLUE,
  }],
  components: [{
    type: 1,
    components: [{
      type: 2, // button
      label: 'JOIN',
      style: 1, // Primary (blue)
      custom_id: 'join',
    }],
  }],
};

const ANNOUNCEMENT_CLOSED = {
  embeds: [{
    title: 'RiNGs',
    thumbnail: {url: RING_IMG_URL},
    description: ANNOUNCEMENT_MSG,
    color: BLUE,
  }],
  components: [{
    type: 1,
    components: [{
      type: 2, label: JOIN, style: 1, custom_id: 'join', disabled: true,
    }],
  }],
};

const WELCOME = {
  content:
    'Welcome! We\'re still waiting for others to sign up. ' +
    'The contest will start shortly.',
  // content:
  //   '歡迎。我們還在等其他人加入。賭注很快地就會開始。.',
  ephemeral: true,
};

/*
TRAP

You saw a small trial leading to the woods. This could be a short cut.
- Take the small trial
- Stay on the main road

The road is getting roacky

There was a heavy shower, and the road became very muddy.

*/

/* eslint-disable max-len */
const SPECIAL_SCENARIOS = [
  require('res/en.lamp'),
  require('res/en.trapA'),
  require('res/en.triggerA'),
  require('res/en.trapB'),
  require('res/en.duel'),
  require('res/en.marble'),
];

/* eslint-enable max-len */

/** RiNG player */
class Player {
  /**
   * @param {RiNGMaster} master
   * @param {Interaction} i First interaction
   */
  constructor(master, i) {
    const playerName = (i.member.nickname||i.member.user.username);
    this.master = master;
    this.player = i.member;
    this.playerName = playerName;
    this.alive = true;
    this.medal = 0;
    this.interaction = i;

    this.collector = null;
    this.defaultChoice = 0;
    this.scenario = null;
    this.cachedResponse = '';

    i.followUp(WELCOME);
    console.log(`${playerName} has joined the RiNGs.`);
  }

  /**
   * Start a new day
   * @param {object} scenario
   */
  startDay(scenario) {
    this.scenario = scenario;

    const buttons = [];
    let choices;
    let story;
    if ((scenario.type == SCENARIO_TYPE.SPECIAL)||
      (scenario.type == SCENARIO_TYPE.PVP_DUEL)
    ) {
      const s = scenario.getScenario(this.master.data, this);
      choices = s.choices;
      story = s.story;
    } else {
      choices = scenario.choices;
      story = scenario.story;
    }
    this.defaultChoice = diceRoll(choices.length);

    let response = `**Day ${this.master.days}**\n${story}`;
    if (this.cachedResponse.length) {
      response = this.cachedResponse + '\n\n' + response;
      this.cachedResponse = '';
    }

    for (let bi = 0; bi < choices.length; bi++) {
      buttons.push({
        type: 2, label: choices[bi],
        style: 1, custom_id: bi.toString(),
      });
    }
    const content = {
      content: response,
      ephemeral: true,
      components: [{type: 1, components: buttons}],
    };
    this.interaction.followUp(content).then( (msg) => {
      this.collector = msg.createMessageComponentCollector(RESPONSE_FILTER);
      this.collector.on('collect', (i) => {
        this.interaction = i;
        i.deferUpdate();
        this.processChoice(parseInt(i.customId));
      });

      if (scenario.type != SCENARIO_TYPE.PVP_DUEL) { // no timeout for duels!
        this.collector.on('end', (i, reason) => {
          // console.log(this.collector.collected.first().customId);
          if (reason == 'time') this.processChoice(undefined);
        });
      }
    });
  }

  /**
   * End of the new day
   * @return {Boolean}
   */
  endDay() {
    if (this.scenario.type == SCENARIO_TYPE.  PVP_DUEL) {
      const result = this.scenario.resolveDuel(this.master.data, this);
      let response = result.message;

      if (result.result == RESOLUTION_TYPE.ELIMINATED) {
        if (this.medal) {
          this.medal--;
          response += REVIVE_MSG;
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          response += MASTER_REVIVE_MSG;
        } else {
          this.alive = false;
          response += DEATH_MSG;
        }
      }
      this.cachedResponse = response;
    }

    if ((!this.alive) && (this.cachedResponse.length)) {
      // Send last message (won't be another day)
      this.interaction.followUp({
        content: this.cachedResponse,
        ephemeral: true,
      });
    }

    return this.alive;
  }

  /**
   * Live or die?
   * @param {Integer} choice
  */
  processChoice(choice) {
    let response;
    let result;
    const scenario = this.scenario;

    if (scenario.type == SCENARIO_TYPE.PVP_DUEL) {
      this.scenario.resolveChoice(this.master.data, choice, this);
      return;
    }

    const CHOICE = (choice == undefined)?this.defaultChoice:choice;
    if (scenario.type == SCENARIO_TYPE.SPECIAL) {
      result = this.scenario.resolveChoice(this.master.data, CHOICE, this);
    } else {
      const __result = this.scenario.results[CHOICE];
      result = __result[diceRoll(__result.length)];
    } // end normal scenario

    response = result.message;

    switch (result.result) {
      case RESOLUTION_TYPE.MEDAL_X1:
        if (this.medal < MAX_MEDAL) this.medal++;
        break;
      case RESOLUTION_TYPE.MEDAL_X2:
        this.medal += 2;
        if (this.medal > MAX_MEDAL) this.medal = MAX_MEDAL;
        break;
      case RESOLUTION_TYPE.MEDAL_X3:
        this.medal += 3;
        if (this.medal > MAX_MEDAL) this.medal = MAX_MEDAL;
        break;
      case RESOLUTION_TYPE.ELIMINATED:
        if (this.medal) {
          this.medal--;
          response += REVIVE_MSG;
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          response += MASTER_REVIVE_MSG;
        } else {
          this.alive = false;
          response += DEATH_MSG;
        }
        break;
      case RESOLUTION_TYPE.SURVIVED:
      case RESOLUTION_TYPE.PENDING:
      default:
    }

    if (choice == undefined) {
      console.log(`${this.playerName} timed out.`);
      this.cachedResponse = response;
    } else {
      this.interaction.followUp({content: response, ephemeral: true});
    };
  }
}

/** RiNG Master */
class RiNGMaster {
  /**
   * @param {TextChannel} channel
   */
  constructor(channel) {
    this.players = [];
    this.channel = channel;
    this.days = 0;
    this.data = {
      lampUsed: false, lampUsedBy: '',
      trapASet: false, trapA: 0, trapABy: '',
      trapBSet: false, trapB: 0, trapBBy: '',
      playerA: null, playerB: null,
      playerAChoice: undefined, playerBChoice: undefined,
    };
    this.gameSummary = [];
    channel
        .send(ANNOUNCEMENT)
        .then((msg)=> {
          const contestantIds = [];
          const collector = msg
              .createMessageComponentCollector(ENTROLL_FILTER);
          collector.on('collect',
              (interaction) => {
                interaction.deferUpdate();
                if (contestantIds.includes(interaction.member.id)) return;
                this.players.push(new Player(this, interaction));
                contestantIds.push(interaction.member.id);
                if (this.players.length ==3) {
                  this.players[0].medal = 1;
                  this.players[1].medal = 1;
                  this.players[2].medal = 1;
                  /* eslint-disable max-len */
                  this.channel.send(
                      `**${this.players[0].playerName}**, **${this.players[1].playerName}**, and ` +
                      `**${this.players[2].playerName}** have taken a headstart! ` +
                      'They each will be awarded an Honor Medal.',
                  );
                  /* eslint-enable max-len */
                }
                if (this.players.length >= PLAYER_LIMIT) collector.stop();
              },
          );
          collector.on('end', (collected) => {
            msg.edit(ANNOUNCEMENT_CLOSED);
            channel.send(
                '**RiNGs** has started! Best of luck to all of our ' +
                `**${this.players.length}** players.`);
            // channel.send(
            //     '荒謬的賭注開始了！祝我們' +
            //     `**${this.players.length}**名玩家玩得愉快！`);
            pause(PAUSE_BEFORE_GAME_START).then(() => this.startDay());
          });
        });
  }

  /** Start a day */
  startDay() {
    let scenario;
    this.days++;

    this.playerAIdx = -1;
    this.playerBIdx = -1;
    if (this.players.length >= SPECIAL_TRIGGER) {
      const SPECIAL_IDX =
        (this.days == 1)?4:diceRoll(SPECIAL_SCENARIOS.length + 4);
      if (SPECIAL_IDX < SPECIAL_SCENARIOS.length) {
        scenario = SPECIAL_SCENARIOS[SPECIAL_IDX];
        if (scenario.type = SCENARIO_TYPE.SPECIAL) {
          this.playerAIdx = diceRoll(this.players.length);
          scenario = SPECIAL_SCENARIOS[SPECIAL_IDX];
          this.players[this.playerAIdx].startDay(scenario);
        } if (scenario.type == SCENARIO_TYPE.PVP_DUEL) {
          const AIdx = diceRoll(this.players.length);
          let BIdx = diceRoll(this.players.length);
          if (AIdx == BIdx) BIdx = diceRoll(this.players.length);
          if (AIdx !== BIdx) {
            this.playerAIdx = AIdx;
            this.playerBIdx = BIdx;
            scenario.setPlayers(
                this.data,
                this.players[AIdx],
                this.players[BIdx],
            );
            this.players[AIdx].startDay(scenario);
            this.players[BIdx].startDay(scenario);
          }
        }
      }
    }

    for (let pi=0; pi < this.players.length; pi++) {
      if ((pi != this.playerAIdx) && (pi != this.playerBIdx)) {
        scenario = SCENARIOS[diceRoll(SCENARIOS.length)];
        // scenario = SCENARIOS[SCENARIOS.length-1];
        this.players[pi].startDay(scenario);
      }
    }
    puase(RESPONSE_TIME+0.5).then(() => this.endDay());
  }

  /** End a day */
  async endDay() {
    const survivors = [];
    const eliminated = [];
    this.players.forEach((p) => {
      if (p.endDay()) {
        survivors.push(p);
      } else {
        eliminated.push(p.playerName);
      }
    });

    let SUMMARY = '__Day ' + this.days + '__\n';
    if (eliminated.length == 0) {
      SUMMARY += 'No player was eliminated.';
    } else if (eliminated.length == 1) {
      SUMMARY += `1 player was eliminated: ${eliminated[0]}`;
    } else {
      SUMMARY +=
        eliminated.length + ' players were eliminated: ' +
        eliminated.join(', ');
    }
    this.gameSummary.push(SUMMARY);

    this.players = survivors;

    let gameEnded = false;
    if (survivors.length <= WINNER_LIMIT) {
      gameEnded = true;
      this.gameSummary.push(
          '**The RiNGs round has ended!** The **Lords of the RiNGs** are:\n' +
          survivors.map((p)=>'<@'+p.player.id+'>').join(', '),
      );
    } else if (survivors.length == 0) {
      gameEnded = true;
      this.gameSummary.push(
          '**The RiNGs round has ended!** ' +
          'Unfortunately none of our players has survived!',
      );
    }

    if (gameEnded) {
      this.channel.send(this.gameSummary.join('\n\n'));
      this.gameSummary = [];
      this.players = [];
      return;
    }

    let pauseTime = PAUSE_AFTER_DAY_ENDS;
    if (this.gameSummary.length >= 5) {
      await this.channel.send(
          this.gameSummary.join('\n\n') + '\n\n**' +
          survivors.length + '** players remaining.',
      );
      this.gameSummary = [];
      pauseTime += 5;
    }
    pause(pauseTime).then(() => this.startDay());
  }
};

const lotr = {
  name: 'ring',
  async execute(cmdRes, settings, msg, args) {
    if (GAME_CHANNELS.includes(msg.channelId)) {
      if (msg.channelId == '903150247142903878') {
        const CB = msg.client.AOW_CB;
        CB.send(
            'A round of RiNG is starting in 10 seconds. ' +
            'Head over to <#903150247142903878> to play!',
        );
        pause(10).then(()=>{
          CB.send('Alright. Let\'s go! <#903150247142903878>');
          new RiNGMaster(msg.channel);
        });
      } else {
        new RiNGMaster(msg.channel);
      }
    }
  },
};

module.exports = lotr;
