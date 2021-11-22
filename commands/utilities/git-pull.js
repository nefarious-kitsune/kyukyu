const GLOBAL = require('../../global');
const {exec} = require('child_process');

module.exports = {
  name: 'git-pull',
  async execute(cmdRes, settings, msg, args) {
    if (!GLOBAL.SUPER_USERS.includes(msg.author.id)) return;
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      } else {
        msg.channel.send('Git pulled');
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  },
};
