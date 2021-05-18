const res = require('../res/res');
const {literal} = require('./literal');

/**
 * @param {object} settings
 * @param {object} content
 */
function touchEmbed(settings, content) {
  const l10n = res.l10n[settings.lang];
  if (!content.embed.hasOwnProperty('footer')) {
    content.embed['footer'] = {text: l10n.EMBED_FOOTER};
  } else {
    content.embed.footer.text =
      literal(content.embed.footer.text, '{PREFIX}', settings.prefix);
  }
}

exports.touchEmbed = touchEmbed;
