// Typographic composition = the foundation. The motif layer (defs+body) is drawn
// BEHIND the type and kept subtle. Typography always leads.

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * @param {object} o
 * @param {object} o.palette  {name,bg,ink,accent,dark}
 * @param {object} o.type     {title,sub,author}  family names
 * @param {object} o.text     {titleLines,subtitleLines,author}
 * @param {number} o.w @param {number} o.h
 * @param {'left'|'center'} [o.align]
 * @param {{defs:string,body:string}} [o.back]  motif layer behind the type
 * @param {boolean} [o.rule]  short accent hairline under the title
 */
export function buildCover({ palette, type, text, w = 1600, h = 2560, align = 'left', back = { defs: '', body: '' }, rule = true }) {
  const m = Math.round(w * 0.095)
  const center = align === 'center'
  const x = center ? Math.round(w / 2) : m
  const anchor = center ? 'middle' : 'start'

  // scale system (relative to width)
  const titleSize = Math.round(w * 0.158)
  const titleLeading = Math.round(titleSize * 0.9)
  const subSize = Math.round(w * 0.0305)
  const subLeading = Math.round(subSize * 1.42)
  const authorSize = Math.round(w * 0.0235)

  // title block: high, commanding, generous lower field
  const titleTop = Math.round(h * 0.135) + titleSize
  const titleTSpans = text.titleLines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : titleLeading}">${esc(line)}</tspan>`)
    .join('')
  const titleBottom = titleTop + (text.titleLines.length - 1) * titleLeading

  // short accent hairline
  const ruleY = titleBottom + Math.round(titleSize * 0.42)
  const ruleW = Math.round(w * 0.10)
  const ruleX1 = center ? x - Math.round(ruleW / 2) : x
  const ruleEl = rule
    ? `<line x1="${ruleX1}" y1="${ruleY}" x2="${ruleX1 + ruleW}" y2="${ruleY}" stroke="${palette.accent}" stroke-width="${Math.max(2, Math.round(w * 0.0015))}"/>`
    : ''

  // subtitle (accent on dark, ink on light)
  const subColor = palette.dark ? palette.accent : palette.ink
  const subOpacity = palette.dark ? 1 : 0.82
  const subY = ruleY + Math.round(subSize * 1.65)
  const subTSpans = text.subtitleLines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : subLeading}">${esc(line)}</tspan>`)
    .join('')

  // author: small tracked caps, bottom
  const authorY = h - m
  const author = esc(text.author).toUpperCase()

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${back.defs}</defs>
  <rect width="${w}" height="${h}" fill="${palette.bg}"/>
  ${back.body}
  <text x="${x}" y="${titleTop}" text-anchor="${anchor}" font-family="${type.title}" font-size="${titleSize}" fill="${palette.ink}" letter-spacing="${(-titleSize * 0.005).toFixed(2)}">${titleTSpans}</text>
  ${ruleEl}
  <text x="${x}" y="${subY}" text-anchor="${anchor}" font-family="${type.sub}" font-size="${subSize}" fill="${subColor}" opacity="${subOpacity}" letter-spacing="${(subSize * 0.01).toFixed(2)}">${subTSpans}</text>
  <text x="${x}" y="${authorY}" text-anchor="${anchor}" font-family="${type.author}" font-size="${authorSize}" fill="${palette.ink}" opacity="0.66" letter-spacing="${(authorSize * 0.14).toFixed(2)}">${author}</text>
</svg>`
}
