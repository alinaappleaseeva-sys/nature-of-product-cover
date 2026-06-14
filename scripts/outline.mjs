// Build a fully-vector, text-OUTLINED print SVG (for the print PDF). The live-text
// master (src/covers/ebook.svg) is untouched. Geometry comes from coverLayout, so
// outlines match the on-screen master exactly.
import opentype from 'opentype.js'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { coverLayout } from '../src/lib/layout.mjs'
import { leadOpts } from '../src/lib/covers.mjs'

mkdirSync('exports/print', { recursive: true })

const fontCache = {}
function loadFont(family) {
  if (!fontCache[family]) {
    const b = readFileSync('assets/fonts/' + family.replace(/ /g, '') + '.ttf')
    fontCache[family] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
  }
  return fontCache[family]
}

// glyph-by-glyph so we can honour letter-spacing; anchor=start (left) → x is origin
function linePath(family, str, x, y, size, ls = 0) {
  const font = loadFont(family)
  const scale = size / font.unitsPerEm
  let pen = x, d = ''
  for (const g of font.stringToGlyphs(str)) {
    d += g.getPath(pen, y, size).toPathData(2) + ' '
    pen += g.advanceWidth * scale + ls
  }
  return d.trim()
}

const L = coverLayout(leadOpts('print'))
const { w, h, x } = L

const titleD = L.title.lines.map((line, i) => linePath(L.title.family, line, x, L.title.top + i * L.title.leading, L.title.size, L.title.letterSpacing)).join(' ')
const subD = L.sub.lines.map((line, i) => linePath(L.sub.family, line, x, L.sub.y + i * L.sub.leading, L.sub.size, L.sub.letterSpacing)).join(' ')
const authorD = linePath(L.author.family, L.author.text, x, L.author.y, L.author.size, L.author.letterSpacing)
const ruleEl = L.rule ? `<line x1="${L.rule.x1}" y1="${L.rule.y}" x2="${L.rule.x2}" y2="${L.rule.y}" stroke="${L.rule.stroke}" stroke-width="${L.rule.width}"/>` : ''

// physical size 6.25×9.25in (=1875×2775 @300dpi) incl. 0.125in bleed all sides
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="6.25in" height="9.25in" viewBox="0 0 ${w} ${h}">
  <defs>${L.back.defs}</defs>
  <rect width="${w}" height="${h}" fill="${L.bg}"/>
  ${L.back.body}
  <path d="${titleD}" fill="${L.title.fill}"/>
  ${ruleEl}
  <path d="${subD}" fill="${L.sub.fill}" fill-opacity="${L.sub.opacity}"/>
  <path d="${authorD}" fill="${L.author.fill}" fill-opacity="${L.author.opacity}"/>
</svg>`
writeFileSync('exports/print/print-outlined.svg', svg)
console.log('wrote exports/print/print-outlined.svg (vector, text outlined, 6.25×9.25in)')
