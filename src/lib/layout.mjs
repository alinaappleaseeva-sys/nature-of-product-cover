// Typographic composition = the foundation of the cover.
// The motif (fractal / self-similar layer) is passed in and rendered BEHIND the
// type, kept subtle. Typography always leads.

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Build a cover SVG (ebook ratio by default).
 * @param {object} o
 * @param {object} o.palette  {name,bg,ink,accent}
 * @param {object} o.fonts    {serif,sans}
 * @param {object} o.text     {titleLines,subtitleLines,author}
 * @param {number} o.w
 * @param {number} o.h
 * @param {'left'|'center'} [o.align]
 * @param {string} [o.motif]  SVG fragment drawn behind the type (optional)
 * @returns {string} SVG markup
 */
export function buildCover({
  palette,
  fonts,
  text,
  w = 1600,
  h = 2560,
  align = 'left',
  motif = '',
}) {
  const m = Math.round(w * 0.094) // outer margin
  const center = align === 'center'
  const x = center ? Math.round(w / 2) : m
  const anchor = center ? 'middle' : 'start'

  // --- scale system (relative to width) ---
  const titleSize = Math.round(w * 0.135)
  const titleLeading = Math.round(titleSize * 1.0)
  const subSize = Math.round(w * 0.0305)
  const subLeading = Math.round(subSize * 1.45)
  const authorSize = Math.round(w * 0.026)

  // --- vertical rhythm: title high, generous lower field ---
  let y = Math.round(h * 0.205)
  const titleTSpans = text.titleLines
    .map((line, i) => {
      const dy = i === 0 ? 0 : titleLeading
      return `<tspan x="${x}" dy="${dy}">${esc(line)}</tspan>`
    })
    .join('')

  const titleBottom = y + (text.titleLines.length - 1) * titleLeading

  // accent hairline between title and subtitle
  const ruleY = titleBottom + Math.round(titleSize * 0.55)
  const ruleW = Math.round(w * 0.14)
  const ruleX1 = center ? x - Math.round(ruleW / 2) : x
  const ruleX2 = ruleX1 + ruleW

  // subtitle
  const subY = ruleY + Math.round(subSize * 1.7)
  const subTSpans = text.subtitleLines
    .map((line, i) => {
      const dy = i === 0 ? 0 : subLeading
      return `<tspan x="${x}" dy="${dy}">${esc(line)}</tspan>`
    })
    .join('')

  // author, bottom
  const authorY = h - m

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${palette.bg}"/>
  <g opacity="1">${motif}</g>
  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${fonts.serif}" font-weight="380" font-size="${titleSize}" fill="${palette.ink}" letter-spacing="${-titleSize * 0.01}">${titleTSpans}</text>
  <line x1="${ruleX1}" y1="${ruleY}" x2="${ruleX2}" y2="${ruleY}" stroke="${palette.accent}" stroke-width="${Math.max(2, Math.round(w * 0.0017))}"/>
  <text x="${x}" y="${subY}" text-anchor="${anchor}" font-family="${fonts.sans}" font-weight="400" font-size="${subSize}" fill="${palette.ink}" opacity="0.86" letter-spacing="${subSize * 0.01}">${subTSpans}</text>
  <text x="${x}" y="${authorY}" text-anchor="${anchor}" font-family="${fonts.sans}" font-weight="500" font-size="${authorSize}" fill="${palette.ink}" opacity="0.72" letter-spacing="${authorSize * 0.06}">${esc(text.author)}</text>
</svg>`
}
