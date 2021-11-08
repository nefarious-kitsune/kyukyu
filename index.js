const fs = require('fs');
const path = require('path');
const res = require('./res/res');

const {Client, Collection, Intents} = require('discord.js');

const guildConfig = require('./helpers/config.js');
guildConfig.load();
setInterval(
    function() {
      guildConfig.save();
    },
    1000*60*5,
);

let configFilePath = path.resolve(__dirname, 'config.json');
const processArgs = process.argv.slice(2);
if (processArgs && processArgs[0]) {
  configFilePath = path.resolve(__dirname, processArgs[0]);
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

let secretMessage = '';

const AOW_GUILD_ID = '658594298983350293';
const AOW_CB_ID = '658969855181193238';
const AOW_MSG_LINK =
  `https://discord.com/channels/${AOW_GUILD_ID}/${AOW_CB_ID}/`;

kyukyu.on('ready', async () => {
  console.log(
      fs.readFileSync(path.resolve(__dirname, 'splash.md'), 'utf8'),
  );
  kyukyu.AOW_CB = await kyukyu.channels.cache.get(AOW_CB_ID);
});

kyukyu.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  if (msg.author.id == 706106177439924348) {
    if (msg.content.startsWith(AOW_MSG_LINK)) {
      if (secretMessage.length > 0) {
        replyId = msg.content.substring(
            AOW_MSG_LINK.length,
            msg.content.length);
        kyukyu.AOW_CB.send({
          content: secretMessage,
          reply: {messageReference: replyId},
        });
        secretMessage = '';
      }
      return;
    }

    if (msg.channel.type == 'DM') {
      if (msg.content.toLowerCase().startsWith('say')) {
        if (msg.content.length > 4) {
          what2say = msg.content.substring(4, msg.content.length);
          kyukyu.AOW_CB.send(what2say);
        }
        return;
      } else if (msg.content.toLowerCase().startsWith('msg')) {
        if (msg.content.length > 4) {
          secretMessage = msg.content.substring(4, msg.content.length);
        } else {
          secretMessage = '';
        }
        return;
      }
    } else {
      if (secretMessage.length > 0) {
        if ((msg.reference) && (msg.reference.messageId)) {
          msg.channel.send({
            content: secretMessage,
            reply: {messageReference: msg.reference.messageId},
          });
        } else {
          // ECHO
          msg.channel.send(secretMessage);
        }
        secretMessage = '';
        return;
      }
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
  const prefix = settings.prefix || '?';

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

    if (cmd.args && ! args.length) {
      let reply = `You didn't provide any arguments`;
      if (cmd.usage) {
        reply += '\nThe proper usage would be:' +
              `\`${prefix}${cmd.name} ${cmd.usage}\``;
      }
      msg.channel.send({
        content: reply,
        reply: {messageReference: msg.reference.messageId},
      });
      return;
    }

    console.log(`${msg.author.username}: ${msg.content}`);

    cmd.execute(cmdRes, settings, msg, args).catch((error) => {
      console.error('--------------------------------------------------');
      console.error(`Error executing '${msg.content}'`);
      console.error('> ' + error.message);
    });
  }
});
