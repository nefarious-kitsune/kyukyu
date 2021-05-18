const fs = require('fs');
const path = require('path');

const CONFIG_FILE_PATH = path.resolve(__dirname, '../guilds.json');

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
        id: guildId,
        name: guild.name,
        lang: 'en',
        enable: [],
        disable: [],
        prefix: '?',
      };
      this.guildConfig.guilds.push(settings);
    }
    return settings;
  },

  get(guild, param) {

  },

  setGuildBotChannel(guild, settings, values) {
    if (values[0].toLowerCase() == 'all') {
      settings['bot-channel'] = [];
      return;
    }
    const regex = /^<#(\d+)>$/;
    const channels = [];
    values.forEach( (v) => {
      if (regex.test(v)) {
        channelId = regex.exec(v)[1];
        if (guild.channels.cache.get(channelId).type == 'text') {
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

  setGuild(guild, param, values) {
    const settings = this.getGuildSettings(guild);
    switch (param) {
      case 'prefix':
        return this.setGuildPrefix(guild, settings, values);
      case 'bot-channel':
        return this.setGuildBotChannel(guild, settings, values);
      case 'lang':
        return this.setGuildLang(guild, settings, values);
      case 'enable':
      case 'disable':
      default:
    }
    return false;
  },
};
