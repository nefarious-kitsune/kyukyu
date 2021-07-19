module.exports = {
  name: 'utc',
  async execute(cmdRes, settings, msg, args) {
    const localTime = new Date();

    const YYYY = localTime.getUTCFullYear();

    let MM = localTime.getUTCMonth() + 1;
    if (MM < 10) MM = '0' + MM;

    let DD = localTime.getUTCDate();
    if (DD < 10) DD = '0' + DD;

    let hh = localTime.getUTCHours();
    if (hh < 10) hh = '0' + hh;

    let mm = localTime.getUTCMinutes();
    if (mm < 10) mm = '0' + mm;

    let ss = localTime.getUTCSeconds();
    if (ss < 10) ss = '0' + ss;

    let ms = localTime.getUTCMilliseconds();
    if (ms < 10) ms = '0' + ms;

    msg.channel.send(`${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}:${ms}`);
  },
};
