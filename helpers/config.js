const fs = require('fs');
const path = require('path');
const res = require('../res/res');

const CONFIG_FILE_PATH = path.resolve(__dirname, '../cache/guilds.json');

// these commands should not be disabled
const UTILITY_COMMANDS = ['reload', 'greet', 'kyukyu', 'help', 'clear', 'kill'];

module.exports = {
  guildConfig: {guilds: []},

  load() {
    try {
      fs.accessSync(CONFIG_FILE_PATH, fs.constants.R_OK | fs.constants.W_OK);
      try {
        newGuildConfig = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH));
        this.guildConfig = newGuildConfig;
      } catch (err) {
        console.error('Error reading guilds.json');
      }
    } catch (err) {
      //
    }
  },

  save() {
    const text = JSON.stringify(this.guildConfig);
    try {
      fs.writeFileSync(CONFIG_FILE_PATH, text);
    } catch (err) {
      console.error('Error saving guilds.json');
    }
  },

  getGuildSettings(guild) {
    const guildId = guild.id;
    let settings;
    let i = 0;
    for (; i< this.guildConfig.guilds.length; i++) {
      if (this.guildConfig.guilds[i].id === guildId) {
        settings = this.guildConfig.guilds[i];
        break;
      }
    }
    if (i >= this.guildConfig.guilds.length) {
      settings = {
        'id': guildId,
        'name': guild.name,
        'lang': 'en',
        'disable': [],
        'bot-channel': [],
        'prefix': '?',
      };
      this.guildConfig.guilds.push(settings);
    }
    return settings;
  },

  setGuildBotChannel(guild, settings, values) {
    if (values[0].toLowerCase().trim() == 'all') {
      settings['bot-channel'] = [];
      return true;
    }
    const regex = /^<#(\d+)>$/;
    const channels = [];
    values.forEach( (v) => {
      if (regex.test(v)) {
        channelId = regex.exec(v)[1];
        if (guild.channels.cache.get(channelId).type == 'GUILD_TEXT') {
          channels.push(channelId);
        } else {
        }
      }
    });
    if (channels.length == 0) {
      return false;
    } else {
      settings['bot-channel'] = channels;
      return true;
    }
  },

  setGuildPrefix(guild, settings, values) {
    settings['prefix'] = values[0];
    return true;
  },

  setGuildLang(guild, settings, values) {
    lang = values[0].toLowerCase();
    if (['en', 'zht'].includes(lang)) {
      settings['lang'] = lang;
      return true;
    }
    return false;
  },

  disableCommands(guild, settings, values) {
    let success = false;
    values.forEach( (v) => {
      const cmdRes = res.getCommandRes(settings.lang, v);
      if (
        (cmdRes) &&
        (!UTILITY_COMMANDS.includes(cmdRes.name)) &&
        !settings.disable.includes(cmdRes.name)
      ) {
        settings.disable.push(cmdRes.name);
        success = true;
      }
    });
    return success;
  },

  enableCommands(guild, settings, values) {
    if (values[0].toLowerCase().trim() == 'all') {
      settings['disable'] = [];
      return true;
    }
    let success = false;
    values.forEach( (v) => {
      const cmdRes = res.getCommandRes(settings.lang, v);
      if (cmdRes) {
        i = settings.disable.indexOf(cmdRes.name);
        if (i >= 0) {
          settings.disable.splice(i, 1);
          success = true;
        }
      }
    });
    return success;
  },

  setGuild(guild, param, values) {
    const settings = this.getGuildSettings(guild);
    let success = false;
    switch (param) {
      case 'prefix':
        success = this.setGuildPrefix(guild, settings, values);
        break;
      case 'bot-channel':
        success = this.setGuildBotChannel(guild, settings, values);
        break;
      case 'lang':
        success = this.setGuildLang(guild, settings, values);
        break;
      case 'enable':
        success = this.enableCommands(guild, settings, values);
        break;
      case 'disable':
        success = this.disableCommands(guild, settings, values);
        break;
      default:
    }
    if (success) this.save();
    return success;
  },
};
