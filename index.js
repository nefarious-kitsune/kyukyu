const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');

let configFilePath = path.resolve(__dirname, 'config.json');
const processArgs = process.argv.slice(2);
if (processArgs && processArgs[0]) {
  configFilePath = path.resolve(__dirname, processArgs[0]);
}
const config = JSON.parse(fs.readFileSync(configFilePath));
const prefix = config.prefix || '?';
process.env.prefix = prefix;
process.env.lang = config.lang || 'en';
process.env.TOKEN = config['login token'];

const res = require('./res/res');

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

kyukyu.login(process.env.TOKEN);

kyukyu.on('ready', () => {
  console.log(res.locale.SPLASH);
});

kyukyu.on('message', (msg) => {
  if (msg.author.bot) return;

  if ( msg.content.startsWith(prefix) ) {
    const args = parseArgs(prefix, msg.content);
    const cmdName = args.shift().toLowerCase();

    const cmd =
        kyukyu.commands.get(cmdName) ||
        kyukyu.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(cmdName)
        );

    if (!cmd) return;

    if (cmd.args && ! args.length) {
      let reply = `You didn't provide any arguments`;
      if (cmd.usage) {
        reply += '\nThe proper usage would be:' +
              `\`${prefix}${cmd.name} ${cmd.usage}\``;
      }
      return msg.reply(reply);
    }

    cmd.execute(msg, args).catch((error)=> {
      console.error('-------------------------------');
      console.error(`Error executing '${msg.content}'`);
      console.error(error);
    });
  }
});
