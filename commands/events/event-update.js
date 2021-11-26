const fs = require('fs');
const path = require('path');
const res = require('../../res/res');

const GLOBAL = require('../../global');

const {google} = require('googleapis');
const oauth = require('../../helpers/oauth');

const SHEET_ID = '1gCbDpHcmGdoZx5oCD5b-dszTeiJNClWSvO6JYYlMnWE';

/**
 * Update Google sheet content
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function writeData(auth) {
  formatDate = (d) => {
    yyyy = d.getUTCFullYear();
    mm = d.getUTCMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    dd = d.getUTCDate();
    if (dd < 10) dd = '0' + dd;
    return (yyyy + '-' + mm + '-' + dd);
  };

  const sheets = google.sheets({version: 'v4', auth});

  let l10n = res.l10n['en'];
  const FILE_PATH = path.resolve(__dirname, '../../cache/events.json');
  const events = JSON.parse(fs.readFileSync(FILE_PATH)).events;

  let values = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const heroes = event.heroes.map((h)=>l10n.HERO_DISPLAY_NAMES[h]);
    values.push([
      formatDate(new Date(event.date)),
      formatDate(new Date(event.date + (7 * 24 * 60 * 60 * 1000))),
      heroes.join(', '),
    ]);
  }

  sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Events!A1',
    valueInputOption: 'USER_ENTERED',
    resource: {values},
  }, (err, result) => {
    if (err) {
      // Handle error
      console.log(err);
    } else {
      console.log('%d rows updated', result.data.updatedRows);
    }
  });

  l10n = res.l10n['zht'];
  values = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const heroes = event.heroes.map((h)=>l10n.HERO_DISPLAY_NAMES[h]);
    values.push([
      formatDate(new Date(event.date)),
      formatDate(new Date(event.date + (7 * 24 * 60 * 60 * 1000))),
      heroes.join(', '),
    ]);
  }

  sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: '活動!A1',
    valueInputOption: 'USER_ENTERED',
    resource: {values},
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('%d rows updated', result.data.updatedRows);
    }
  });
}

module.exports = {
  name: 'event-update',
  async execute(cmdRes, settings, msg, args) {
    if (msg.author.id == GLOBAL.USER_KITSUNE_ID) {
      oauth(writeData);
    }
  },
};
