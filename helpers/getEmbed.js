const fs = require('fs');
const res = require('../res/res');
const {literal} = require('./literal');

/**
 * @param {object} settings
 * @param {string} fPath file path
 * @return {object}
 */
function getEmbed(settings, fPath) {
  try {
    const embed = JSON.parse(fs.readFileSync(fPath, 'utf8'));
    const l10n = res.l10n[settings.lang];
    if (!embed.hasOwnProperty('footer')) {
      embed.footer = {text: l10n.EMBED_FOOTER};
    } else {
      embed.footer.text =
        literal(embed.footer.text, '{PREFIX}', settings.prefix);
    }
    return embed;
  } catch (err) {
    console.error(`Failure loading embed from "${fPath}"`);
    return {'description': 'Error loading content...'};
  }
}

exports.getEmbed = getEmbed;
