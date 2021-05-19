const fs = require('fs');
const path = require('path');
const res = require('./res/res');

const Discord = require('discord.js');

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

const kyukyu = new Discord.Client();
kyukyu.commands = new Discord.Collection();

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

kyukyu.on('ready', () => {
  console.log(
      fs.readFileSync(path.resolve(__dirname, 'splash.md'), 'utf8'),
  );
});

kyukyu.on('message', (msg) => {
  if (msg.author.bot) return;

  let settings;
  if (msg.channel.type === 'text') {
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

    const cmd = kyukyu.commands.get(cmdRes.name);

    if (cmd.args && ! args.length) {
      let reply = `You didn't provide any arguments`;
      if (cmd.usage) {
        reply += '\nThe proper usage would be:' +
              `\`${prefix}${cmd.name} ${cmd.usage}\``;
      }
      return msg.reply(reply);
    }

    cmd.execute(cmdRes, settings, msg, args).catch((error) => {
      console.error('--------------------------------------------------');
      console.error(`Error executing '${msg.content}'`);
      console.error('> ' + error.message);
    });
  }
});
