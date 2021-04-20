const fs = require('fs');

const Discord = require('discord.js');
const {prefix} = require('./config.json');

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

require('dotenv').config();
const TOKEN = process.env.TOKEN;
kyukyu.login(TOKEN);

kyukyu.on('ready', () => {
  console.log(`┌───────────────────────────────────────────────────────┐`);
  console.log(`│                                                       │`);
  console.log(`│  ─=≡Σ(((^._.^)彡                                     │`);
  console.log(`│ Catfish is overrated. Enters the foxfish...           │`);
  console.log(`│                                                       │`);
  console.log(`└───────────────────────────────────────────────────────┘`);
});

kyukyu.on('message', (msg) => {
  if (msg.author.bot) return;

  if ( msg.content.startsWith(prefix) ) {
    const args = msg.content.substring(prefix.length).split(/\s+/);
    const cmdName = args.shift().toLowerCase();

    if (!kyukyu.commands.has(cmdName)) return;

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

    cmd.execute(msg, args).catch((error)=>console.error(error));
  }
});
