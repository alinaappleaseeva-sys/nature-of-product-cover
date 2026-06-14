// v1.0 deliverable build — generates all final export files.
// Run from repo root: node scripts/build-v1.mjs
// Requires: rsvg-convert (librsvg) + gs (ghostscript) in PATH.
import { Resvg } from '@resvg/resvg-js'
import opentype from 'opentype.js'
import { execSync } from 'node:child_process'
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { buildLead, leadOpts } from '../src/lib/covers.mjs'
import { coverLayout } from '../src/lib/layout.mjs'
import { canvas } from '../src/lib/tokens.mjs'

mkdirSync('exports/ebook',    { recursive: true })
mkdirSync('exports/print',    { recursive: true })
mkdirSync('exports/source',   { recursive: true })
mkdirSync('exports/thumbnails', { recursive: true })

const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()

// ── 1. Ebook PNG (1600×2560 RGB) ────────────────────────────────────────────
const ebookSvg = buildLead('ebook')
writeFileSync('src/covers/ebook.svg', ebookSvg)
writeFileSync('exports/ebook/nature-of-product-ebook.png', png(ebookSvg, canvas.ebook.w))
console.log('✓ exports/ebook/nature-of-product-ebook.png')

// ── 2. Thumbnail (120px wide) ───────────────────────────────────────────────
writeFileSync('exports/ebook/thumbnail-120px.png', png(ebookSvg, 120))
console.log('✓ exports/ebook/thumbnail-120px.png')

// ── 3. Editable source — live text, print dimensions ────────────────────────
const livePrintSvg = buildLead('print').replace(
  `width="${canvas.print.w}" height="${canvas.print.h}"`,
  `width="6.25in" height="9.25in"`
)
writeFileSync('exports/source/nature-of-product-live-text.svg', livePrintSvg)
console.log('✓ exports/source/nature-of-product-live-text.svg')

// ── 4. Outlined SVG (text → paths, for print shop) ──────────────────────────
const fontCache = {}
function loadFont(family) {
  if (!fontCache[family]) {
    const b = readFileSync('assets/fonts/' + family.replace(/ /g, '') + '.ttf')
    fontCache[family] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
  }
  return fontCache[family]
}
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
const titleD = L.title.lines.map((line, i) =>
  linePath(L.title.family, line, x, L.title.top + i * L.title.leading, L.title.size, L.title.letterSpacing)
).join(' ')
const subD = L.sub.lines.map((line, i) =>
  linePath(L.sub.family, line, x, L.sub.y + i * L.sub.leading, L.sub.size, L.sub.letterSpacing)
).join(' ')
const authorD = linePath(L.author.family, L.author.text, x, L.author.y, L.author.size, L.author.letterSpacing)
const ruleEl = L.rule ? `<line x1="${L.rule.x1}" y1="${L.rule.y}" x2="${L.rule.x2}" y2="${L.rule.y}" stroke="${L.rule.stroke}" stroke-width="${L.rule.width}"/>` : ''

const outlinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="6.25in" height="9.25in" viewBox="0 0 ${w} ${h}">
  <defs>${L.back.defs}</defs>
  <rect width="${w}" height="${h}" fill="${L.bg}"/>
  ${L.back.body}
  <path d="${titleD}" fill="${L.title.fill}"/>
  ${ruleEl}
  <path d="${subD}" fill="${L.sub.fill}" fill-opacity="${L.sub.opacity}"/>
  <path d="${authorD}" fill="${L.author.fill}" fill-opacity="${L.author.opacity}"/>
</svg>`
writeFileSync('exports/print/nature-of-product-outlined.svg', outlinedSvg)
console.log('✓ exports/print/nature-of-product-outlined.svg')

// ── 5a. Print RGB PDF ────────────────────────────────────────────────────────
execSync('rsvg-convert -f pdf -o exports/print/nature-of-product-print-rgb.pdf exports/print/nature-of-product-outlined.svg', { stdio: 'inherit' })
console.log('✓ exports/print/nature-of-product-print-rgb.pdf')

// ── 5b. Print CMYK PDF ───────────────────────────────────────────────────────
execSync([
  'gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pdfwrite',
  '-dProcessColorModel=/DeviceCMYK -sColorConversionStrategy=CMYK',
  '-dEncodeColorImages=true',
  '-o exports/print/nature-of-product-print.pdf',
  'exports/print/nature-of-product-print-rgb.pdf',
].join(' '), { stdio: 'inherit' })
console.log('✓ exports/print/nature-of-product-print.pdf')

// ── 5c. Print preview PNG ────────────────────────────────────────────────────
execSync([
  'gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r150',
  '-o exports/print/nature-of-product-print-preview.png',
  'exports/print/nature-of-product-print.pdf',
].join(' '), { stdio: 'inherit' })
console.log('✓ exports/print/nature-of-product-print-preview.png')

console.log('\nAll v1.0 deliverables written.')
