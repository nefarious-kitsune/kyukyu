const {createCanvas} = require('canvas');
const fs = require('fs');

color = function(hexColor) {
  const hex = hexColor.substring(1);
  /* Get the RGB values to calculate the Hue. */
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  /* Getting the Max and Min values for Chroma. */
  const max = Math.max.apply(Math, [r, g, b]);
  const min = Math.min.apply(Math, [r, g, b]);

  /* Variables for HSV value of hex color. */
  const chr = max - min;
  let hue = 0;
  const val = max;
  let sat = 0;

  if (val > 0) {
    /* Calculate Saturation only if Value isn't 0. */
    sat = chr / val;
    if (sat > 0) {
      if (r == max) {
        hue = 60 * (((g - min) - (b - min)) / chr);
        if (hue < 0) {
          hue += 360;
        }
      } else if (g == max) {
        hue = 120 + 60 * (((b - min) - (r - min)) / chr);
      } else if (b == max) {
        hue = 240 + 60 * (((r - min) - (g - min)) / chr);
      }
    }
  }

  return {
    chroma: chr,
    hue: hue,
    sat: sat,
    val: val,
    luma: 0.3 * r + 0.59 * g + 0.11 * b,
    red: parseInt(hex.substring(0, 2), 16),
    green: parseInt(hex.substring(2, 4), 16),
    blue: parseInt(hex.substring(4, 6), 16),
    hexColor: hexColor,
  };
};

module.exports = {
  name: 'rainbow',
  async execute(cmdRes, settings, msg, args) {
    const CLAN_ROLES = [];
    msg.guild.roles.cache.forEach((role) => {
      if (
        (role.name.length <= 4) &&
        (role.name.toUpperCase() == role.name) &&
        (!role.name.startsWith('@'))
      ) {
        const clanRole = {
          name: role.name,
          color: color(role.hexColor),
        };
        CLAN_ROLES.push(clanRole);
      }
    });

    CLAN_ROLES.sort((a, b) => a.color.hue - b.color.hue);

    const padding = 20;
    const lineSpacing = 4;
    const fontHeight = 20;
    const width = 80 + padding * 2;
    const height =
      (CLAN_ROLES.length * fontHeight) +
      ((CLAN_ROLES.length-1) * lineSpacing) +
      (padding * 2);
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    // context.fillStyle = '#000000';
    // context.fillRect(0, 0, width, height);

    context.font = `${fontHeight}px Candara`;
    context.textBaseline = 'top';
    context.textAlign = 'left';
    let idx = 0;
    CLAN_ROLES.forEach((clanRole) => {
      // console.log(clanRole.name, clanRole.id);
      context.fillStyle = clanRole.color.hexColor;
      const y = idx * (lineSpacing + fontHeight) + padding;
      context.fillText('@'+clanRole.name, padding, y);
      idx++;
    });
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./roles.png', buffer);
    msg.channel.send(
        {files: [{attachment: './roles.png', name: 'roles.png'}]},
    );
  },
};
