const res = require('../res/res');
const {literal} = require('./literal');

/**
 * @param {object} settings
 * @param {object} content
 */
function touchEmbed(settings, content) {
  const l10n = res.l10n[settings.lang];
  if (!content.hasOwnProperty('footer')) {
    content.footer = {text: l10n.EMBED_FOOTER};
  } else {
    content.footer.text =
      literal(content.footer.text, '{PREFIX}', settings.prefix);
  }
}

exports.touchEmbed = touchEmbed;
