const {createCanvas} = require('canvas');
const fs = require('fs');
const GLOBAL = require('../../global');

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
    if (!GLOBAL.TRUSTED_USERS.includes(msg.author.id) &&
      !GLOBAL.SUPER_USERS.includes(msg.author.id)) {
      return;
    }

    msg.client.AOW.roles.cache.forEach((role) => {
      if (
        (role.name.length <= 4) &&
        (role.mentionable) &&
        (!role.name.startsWith('@'))
      ) {
        const clanRole = {
          name: role.name,
          id: role.id,
          color: color(role.hexColor),
        };
        CLAN_ROLES.push(clanRole);
      }
    });

    let colorTables = [];
    for (let i=0; i<20; i++) colorTables.push([]);
    CLAN_ROLES.forEach((clanRole)=> {
      h = Math.floor(clanRole.color.hue/30);
      colorTables[(h>=20)?19:h].push(clanRole);
    });
    colorTables.forEach((row)=>{
      row.sort((a, b) => a.color.luma - b.color.luma);
    });
    colorTables = colorTables.filter((row)=>row.length>0);

    const PADDING = 20;
    const LINE_SPACING = 4;
    const TEXT_HEIGHT = 20;
    const width = 1000;
    const height =
      (colorTables.length * TEXT_HEIGHT) +
      ((colorTables.length-1) * LINE_SPACING) +
      (PADDING * 2);
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.font = `${TEXT_HEIGHT}px serif`;
    context.textBaseline = 'top';
    context.textAlign = 'left';
    const SPACING = context.measureText(' ').width;

    let maxWidth = 0;
    const mentions = [];
    colorTables.forEach((row) => {
      const line = row.map((r)=>'@' + r.name).join(' ');
      const lineWidth = context.measureText(line).width;
      if (lineWidth > maxWidth) maxWidth = lineWidth;
      mentions.push(row.map((r)=>`<@&${r.id}>`).join(' '));
    });
    canvas.width = maxWidth + PADDING * 2;
    context.font = `${TEXT_HEIGHT}px serif`;
    context.textBaseline = 'top';
    context.textAlign = 'left';

    let idx = 0;
    colorTables.forEach((row) => {
      const y = idx * (LINE_SPACING + TEXT_HEIGHT) + PADDING;
      let lineWidth = PADDING - SPACING;
      row.forEach((clanRole) => {
        const text = '@'+clanRole.name;
        context.fillStyle = clanRole.color.hexColor;
        context.fillText(text, lineWidth + SPACING, y);
        lineWidth += context.measureText(text).width + SPACING;
      });
      idx++;
    });

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./cache/roles.png', buffer);
    msg.author.send({
      content: '```' + mentions.join('\n') + '```',
      files: [{attachment: './cache/roles.png', name: 'roles.png'}],
    });
  },
};
