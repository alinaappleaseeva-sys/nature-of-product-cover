// Typographic composition = the foundation. The motif layer (defs+body) is drawn
// BEHIND the type and kept subtle. Typography always leads.
//
// coverLayout() computes all geometry once; buildCover() renders it with <text>,
// and scripts/outline.mjs renders the same geometry with vector glyph paths.

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Compute every position/size/colour for a cover. Pure data, no SVG. */
export function coverLayout({ palette, type, text, w = 1600, h = 2560, align = 'left', back = { defs: '', body: '' }, rule = true, subColor = null, titleScale = 1, subGap = 0.035, titleTopFrac = 0.135 }) {
  const m = Math.round(w * 0.095)
  const center = align === 'center'
  const x = center ? Math.round(w / 2) : m
  const anchor = center ? 'middle' : 'start'

  const titleSize = Math.round(w * 0.158 * titleScale)
  const titleLeading = Math.round(titleSize * 0.9)
  const subSize = Math.round(w * 0.0305)
  const subLeading = Math.round(subSize * 1.42)
  const authorSize = Math.round(w * 0.0235)

  const titleTop = Math.round(h * titleTopFrac) + titleSize
  const titleBottom = titleTop + (text.titleLines.length - 1) * titleLeading

  const ruleY = titleBottom + Math.round(titleSize * 0.42)
  const ruleW = Math.round(w * 0.10)
  const ruleX1 = center ? x - Math.round(ruleW / 2) : x

  const subY = ruleY + Math.round(subSize * 1.65) + Math.round(h * subGap)
  const authorY = h - m

  return {
    w, h, x, anchor, align, bg: palette.bg,
    back,
    title: { family: type.title, size: titleSize, leading: titleLeading, top: titleTop, fill: palette.ink, letterSpacing: -titleSize * 0.005, lines: text.titleLines },
    rule: rule ? { x1: ruleX1, y: ruleY, x2: ruleX1 + ruleW, stroke: palette.accent, width: Math.max(2, Math.round(w * 0.0015)) } : null,
    sub: { family: type.sub, size: subSize, leading: subLeading, x, y: subY, fill: subColor || (palette.dark ? palette.accent : palette.ink), opacity: palette.dark ? 1 : 0.82, letterSpacing: subSize * 0.01, lines: text.subtitleLines },
    author: { family: type.author, size: authorSize, x, y: authorY, fill: palette.ink, opacity: 0.66, letterSpacing: authorSize * 0.14, text: String(text.author).toUpperCase() },
  }
}

/** Render a cover as SVG with live <text>. */
export function buildCover(opts) {
  const L = coverLayout(opts)
  const { w, h, x, anchor } = L
  const titleTSpans = L.title.lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : L.title.leading}">${esc(line)}</tspan>`).join('')
  const subTSpans = L.sub.lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : L.sub.leading}">${esc(line)}</tspan>`).join('')
  const ruleEl = L.rule ? `<line x1="${L.rule.x1}" y1="${L.rule.y}" x2="${L.rule.x2}" y2="${L.rule.y}" stroke="${L.rule.stroke}" stroke-width="${L.rule.width}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${L.back.defs}</defs>
  <rect width="${w}" height="${h}" fill="${L.bg}"/>
  ${L.back.body}
  <text x="${x}" y="${L.title.top}" text-anchor="${anchor}" font-family="${L.title.family}" font-size="${L.title.size}" fill="${L.title.fill}" letter-spacing="${L.title.letterSpacing.toFixed(2)}">${titleTSpans}</text>
  ${ruleEl}
  <text x="${x}" y="${L.sub.y}" text-anchor="${anchor}" font-family="${L.sub.family}" font-size="${L.sub.size}" fill="${L.sub.fill}" opacity="${L.sub.opacity}" letter-spacing="${L.sub.letterSpacing.toFixed(2)}">${subTSpans}</text>
  <text x="${x}" y="${L.author.y}" text-anchor="${anchor}" font-family="${L.author.family}" font-size="${L.author.size}" fill="${L.author.fill}" opacity="${L.author.opacity}" letter-spacing="${L.author.letterSpacing.toFixed(2)}">${esc(L.author.text)}</text>
</svg>`
}
