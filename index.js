const pm2 = require('pm2');
const path = require('path');
const fs = require('fs');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  const processConfig = {
    name: 'kyukyu',
    script: './kyukyu.js',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    args: 'config.json',
  };

  let configFilePath = path.resolve(__dirname, 'config.json');
  const processArgs = process.argv.slice(2);
  if (processArgs && processArgs[0]) {
    configFilePath = path.resolve(__dirname, processArgs[0]);
    processConfig.args = processArgs[0];
  }
  if (!fs.existsSync(configFilePath)) {
    console.error('Cannot load configuration file.');
    return;
  }

  pm2.start(processConfig, function(err, apps) {
    if (err) {
      console.error(err);
      pm2.delete('kyukyu');
    } else {
      console.log(
          fs.readFileSync(path.resolve(__dirname, 'splash.md'), 'utf8'),
      );
    }
    pm2.disconnect(); // Disconnects from PM2
  });
});
