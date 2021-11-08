// const {literal} = require('../../helpers/literal');

const {
  SCENARIO_TYPE, RESOLUTION_TYPE, diceRoll, pause, wait,
} = require('./res/en.common');

const {enroll} = require('./res/en.enroll');

const SCENARIOS =
  require('./res/en.chance')
      .concat(require('./res/en.danger'));

const GAME_CHANNELS = ['903150247142903878', '831064145637539860'];

// Debug
// const GAME_SETTINGS = {
//   RESPONSE_TIME: 15,
//   PAUSE_AFTER_DAY_ENDS: 2,
//   ENTRY_TIME_LIMIT: 10,
//   PLAYER_LIMIT: 10,
//   WINNER_LIMIT: -1,
//   SPECIAL_TRIGGER: 1,
// };

// Production
const GAME_SETTINGS = {
  RESPONSE_TIME: 25,
  PAUSE_AFTER_DAY_ENDS: 15,
  ENTRY_TIME_LIMIT: 90,
  PLAYER_LIMIT: 15,
  WINNER_LIMIT: 2,
  SPECIAL_TRIGGER: 5,
};

const RESPONSE_FILTER = {
  max: 1,
  time: GAME_SETTINGS.RESPONSE_TIME * 1000,
  componentType: 'BUTTON',
};

// const BLUE = 0x3170a6; // (49, 112, 166)
// const RED = 0xb83a34; // (184, 58, 52)
// const GREEN = 0x77993c; // (119, 153, 60)

const RING_MASTER_REVIVE_RATE = 0.08;

const MAX_MEDAL = 5; // maximum number of medals a player can have.

const REVIVE_MSG = '\n\nYou were **revived** with an Honor Medal.';
const MASTER_REVIVE_MSG = '\n\nYou were **revived** by the RiNG Master!';
const DEATH_MSG = '\n\n**You did not make it. Better luck next time.**';

/*
TRAP

You saw a small trial leading to the woods. This could be a short cut.
- Take the small trial
- Stay on the main road

The road is getting roacky

There was a heavy shower, and the road became very muddy.

*/

const SPECIAL_SCENARIOS = [
  require('./res/en.special.lamp'),
  require('./res/en.special.trapA'),
  require('./res/en.special.triggerA'),
  require('./res/en.special.trapB'),
  require('./res/en.special.duel'),
  require('./res/en.special.marble'),
];

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

      this.collector.on('end', (i, reason) => {
        // console.log(this.collector.collected.first().customId);
        if (reason == 'time') this.processChoice(undefined);
      });
    });
  }

  /**
   * Send last message
   */
  async lastMessage() {
    if (this.cachedResponse.length) {
      await this.interaction.followUp({
        content: this.cachedResponse,
        ephemeral: true,
      });
    }
  }

  /**
   * End of the new day
   * @return {Boolean}
   */
  endDay() {
    if (this.scenario.type == SCENARIO_TYPE.PVP_DUEL) {
      const result = this.scenario.resolveDuel(this.master.data, this);
      let response = result.message;

      if (result.type == RESOLUTION_TYPE.ELIMINATED) {
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
      result = this.scenario.resolveChoice(this.master.data, choice, this);
      if (choice != undefined) {
        this.interaction.followUp({
          content: result.message,
          ephemeral: true,
        });
        return;
      }
    } else {
      const CHOICE = (choice == undefined)?this.defaultChoice:choice;
      if (scenario.type == SCENARIO_TYPE.SPECIAL) {
        result = this.scenario.resolveChoice(this.master.data, CHOICE, this);
      } else {
        const __result = this.scenario.results[CHOICE];
        result = __result[diceRoll(__result.length)];
      } // end normal scenario
    }

    response = result.message;
    switch (result.type) {
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
    enroll(GAME_SETTINGS, this);
  }

  /**
   * @param {Interaction} i
   * @return {PLayer}
   */
  addPlayer(i) {
    player = new Player(this, i);
    this.players.push(player);
    return player;
  }

  /** Start a day */
  startDay() {
    let scenario;
    this.days++;

    this.playerAIdx = -1;
    this.playerBIdx = -1;
    if (this.players.length >= GAME_SETTINGS.SPECIAL_TRIGGER) {
      // const SPECIAL_IDX = diceRoll(SPECIAL_SCENARIOS.length + 2);

      const SPECIAL_IDX =
        (this.days == 1)?4:diceRoll(SPECIAL_SCENARIOS.length + 4);

      if (SPECIAL_IDX < SPECIAL_SCENARIOS.length) {
        scenario = SPECIAL_SCENARIOS[SPECIAL_IDX];
        if (scenario.type == SCENARIO_TYPE.SPECIAL) {
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
          // this.playerAIdx = 0;
          // this.playerBIdx = 0;
          // scenario.setPlayers(this.data, this.players[0], this.players[0]);
          // this.players[0].startDay(scenario);
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
    pause(GAME_SETTINGS.RESPONSE_TIME+0.5).then(() => this.endDay());
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
    if (survivors.length <= GAME_SETTINGS.WINNER_LIMIT) {
      gameEnded = true;
      if (survivors.length == 1) {
        this.gameSummary.push(
            'The RiNGs round has ended! The **Lord of the RiNGs** is: ' +
            `<@${survivors[0].player.id}>`,
        );
      } else {
        this.gameSummary.push(
            'The RiNGs round has ended! The **Lords of the RiNGs** are: ' +
            survivors.map((p)=>`<@${p.player.id}>`).join(', '),
        );
      }
    } else if (survivors.length == 0) {
      gameEnded = true;
      this.gameSummary.push(
          'The RiNGs round has ended! ' +
          'Unfortunately **none of our players** has survived!',
      );
    }

    if (gameEnded) {
      this.players.forEach((p) => p.lastMessage());
      wait(GAME_SETTINGS.PAUSE_AFTER_DAY_ENDS);
      this.channel.send(this.gameSummary.join('\n\n'));
      this.gameSummary = [];
      this.players = [];
      return;
    }

    let pauseTime = GAME_SETTINGS.PAUSE_AFTER_DAY_ENDS;
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
