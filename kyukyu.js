const fs = require('fs');
const path = require('path');
const res = require('./res/res');
const GLOBAL = require('./global');
const {normalize} = require('./helpers/normalize');

const {Client, Collection, Intents} = require('discord.js');

const guildConfig = require('./helpers/config.js');
guildConfig.load();

let configFilePath = path.resolve(__dirname, 'config.json');
const processArgs = process.argv.slice(2);
if (processArgs && processArgs[0]) {
  configFilePath = path.resolve(__dirname, processArgs[0]);
}
if (!fs.existsSync(configFilePath)) {
  console.error('Cannot load configuration file.');
  return;
}

const config = JSON.parse(fs.readFileSync(configFilePath));

const {parseArgs} = require('./helpers/parseArgs.js');

const kyukyu = new Client(
    {
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
      partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    },
);

kyukyu.commands = new Collection();
kyukyu.secretMessage = '';

fs.readdirSync('./commands').forEach( (folder) => {
  fs.readdirSync(`./commands/${folder}`)
      .filter( (file) => file.endsWith('.js') )
      .forEach( (file) => {
        const path = `./commands/${folder}/${file}`;
        const cmd = require(path);
        cmd['path'] = path;
        kyukyu.commands.set(cmd.name, cmd);
      });
});

kyukyu.login(config['login token']);

kyukyu.on('ready', async () => {
  console.log('Kyukyu checking in...');
  kyukyu.AOW = await kyukyu.guilds.cache.get('658594298983350293');
  kyukyu.AOW_CB = await kyukyu.channels.cache.get('658969855181193238');
});

kyukyu.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  // ECHO
  if (msg.author.id == GLOBAL.USER_KITSUNE_ID) {
    if (kyukyu.secretMessage.length > 0) {
      if ((msg.reference) && (msg.reference.messageId)) {
        msg.channel.send({
          content: kyukyu.secretMessage,
          reply: {messageReference: msg.reference.messageId},
        });
      } else {
        msg.channel.send(kyukyu.secretMessage);
      }
      kyukyu.secretMessage = '';
      return;
    }
  }

  let settings;
  if (msg.channel.type === 'GUILD_TEXT') {
    settings = guildConfig.getGuildSettings(msg.guild);
  } else {
    settings = {
      id: msg.author.id,
      prefix: '?',
      lang: config.lang,
    };
  }
  const prefix = settings.prefix ?? '?';

  if ( msg.content.startsWith(prefix) ) {
    const args = parseArgs(prefix, msg.content);

    if (args.length == 0) return;

    const cmdName = args.shift();

    const cmdRes = res.getCommandRes(settings.lang, cmdName);
    if (!cmdRes) return;

    if (settings.disable && settings.disable.includes(cmdRes.name)) {
      // Command disabled
      return;
    }

    if (
      (cmdRes.name != 'kyukyu') &&
      (settings['bot-channel']) &&
      (settings['bot-channel'].length > 0) &&
      !(settings['bot-channel'].includes(msg.channel.id))
    ) {
      return; // Not in bot channel
    }

    const cmd = kyukyu.commands.get(cmdRes.name);

    if (cmd.args && !args.length) {
      let reply = `You didn't provide any arguments`;
      if (cmd.usage) {
        reply += '\nThe proper usage would be:' +
              `\`${prefix}${cmd.name} ${cmd.usage}\``;
      }
      msg.channel.send({
        content: reply,
        reply: {messageReference: msg.id},
      });
      return;
    }

    console.log(`${normalize(msg.author.username)}: ${msg.content}`);

    cmd.execute(cmdRes, settings, msg, args).catch((error) => {
      console.error(error);
      console.error('--------------------------------------------------');
      console.error(`Error executing '${msg.content}'`);
      console.error('> ' + error.message);
    });
  }
});
