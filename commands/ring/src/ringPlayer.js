'use strict';

const {SCENARIO_TYPE, RESOLUTION_TYPE} = require('./common');

/** RiNG player */
class Player {
  /**
   * @param {RiNGMaster} master
   * @param {Interaction} i First interaction
   */
  constructor(master, i) {
    const playerName = normalize(i.member.nickname??i.member.user.username);
    this.master = master;
    this.member = i.member;
    this.playerName = playerName.normalize();
    this.alive = true;
    this.medal = 0;
    this.lastInteraction = i;

    this.collector = null;
    this.defaultChoice = 0;
    this.scenario = null;
    this.messages = [];
    this.noReactionCount = 1;
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
      const s = scenario.getScenario(this);
      choices = s.choices;
      story = s.story;
    } else {
      choices = scenario.choices;
      story = scenario.story;
    }
    this.defaultChoice = diceRoll(choices.length);

    this.messages.push(`**Day ${this.master.days}**\n${story}`);

    for (let bIdx = 0; bIdx < choices.length; bIdx++) {
      buttons.push({
        type: 2, label: choices[bIdx],
        style: 1, custom_id: bIdx.toString(),
      });
    }
    const content = {
      content: this.messages.join('\n'),
      ephemeral: true,
      components: [{type: 1, components: buttons}],
    };

    const handler = (msg) => {
      this.collector = msg.createMessageComponentCollector({
        max: 1, time: GAME_SETTINGS.RESPONSE_TIME * 1000,
      });
      this.collector.on('collect', (i) => this.onReaction(i));
      this.collector.on('end', (i, reason) => this.onNoReaction(i, reason));
    };

    if (this.lastInteraction.replied) {
      this.lastInteraction.editReply(content).then(handler);
    } else {
      this.lastInteraction.reply(content).then(handler);
    }
  }

  /**
   * Process interaction
   * @param {Interaction} i Interaction
   */
  onReaction(i) {
    this.processChoice(parseInt(i.customId));
    this.noReactionCount = 0;
    this.lastInteraction = i;
    this.messages = [];
    i.reply({
      content: 'wait....',
      ephemeral: true,
    });
    // i.deferReply();
  }

  /**
   * Automatic interaction
   * @param {Interaction} i Interaction
   * @param {String} reason Reason for
   */
  onNoReaction(i, reason) {
    if (reason == 'time') {
      this.processChoice(undefined);
      this.noReactionCount++;
    }
  }

  /**
   * End of the new day
   * @return {Boolean}
   */
  endDay() {
    if (this.scenario.type == SCENARIO_TYPE.PVP_DUEL) {
      const result = this.scenario.resolveDuel(this);
      let response = result.message;

      if (result.type == RESOLUTION_TYPE.ELIMINATED) {
        if (this.medal) {
          this.medal--;
          response += STRINGS.REVIVE_MSG;
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          response += STRINGS.MASTER_REVIVE_MSG;
        } else {
          this.alive = false;
          response += STRINGS.DEATH_MSG;
        }
      }
      this.messages.push(response);
      const reply = {
        content: this.messages.join('\n\n'),
        ephemeral: true,
        components: [],
      };
      if (this.lastInteraction.replied) {
        this.lastInteraction.editReply(reply);
      } else {
        this.lastInteraction.reply(reply);
      }
    }
    return this.alive;
  }

  /**
   * Live or die?
   * @param {Integer} choice
  */
  processChoice(choice) {
    let result;
    const scenario = this.scenario;
    const CHOICE = (choice == undefined)?this.defaultChoice:choice;

    if (
      (scenario.type == SCENARIO_TYPE.PVP_DUEL)||
      (scenario.type == SCENARIO_TYPE.SPECIAL)
    ) {
      result = this.scenario.resolveChoice(CHOICE, this);
    } else {
      const __result = this.scenario.results[CHOICE];
      result = __result[diceRoll(__result.length)];
    }

    let response = result.message;

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
          response += STRINGS.REVIVE_MSG;
        } else if (Math.random() < RING_MASTER_REVIVE_RATE) {
          response += STRINGS.MASTER_REVIVE_MSG;
        } else {
          this.alive = false;
          response += STRINGS.DEATH_MSG;
        }
        break;
      case RESOLUTION_TYPE.SURVIVED:
      case RESOLUTION_TYPE.PENDING:
      default:
    }

    let log = `${this.master.days}: ${this.playerName} `;
    if (choice == undefined) {
      log += 'timed out.';
    } else if (scenario.choices) {
      log += `chose "${scenario.choices[choice]}".`;
    } else {
      log += `chose "${choice}".`;
    }
    this.master.log(log);

    this.messages.push(response);
    const reply = {
      content: this.messages.join('\n\n'),
      ephemeral: true,
      components: [],
    };
    if (this.lastInteraction.replied) {
      this.lastInteraction.editReply(reply);
    } else {
      this.lastInteraction.reply(reply);
    }
  }
}

module.exports = Player;
