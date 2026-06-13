// Block B — refine the chosen direction B2 (haze green-dark).
// Addresses the 3 notes: (1) dissolve/geometrize the branching into STRUCTURE,
// (2) lower the motif + fade so it doesn't fight the title, (3) verify cream-on-
// green contrast at thumbnail. Outputs a compare sheet: full / 120px / grayscale.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { palettes, text, pairings, canvas } from '../src/lib/tokens.mjs'
import { hazeFractal, softLight, lighten, mix } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v2-b2'
mkdirSync(OUT, { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()

// green palettes
const green = palettes.greenDark                       // #0F1A14
const greenChroma = { ...green, name: 'green chroma', bg: '#13271C' } // a touch more green identity

function buildBack(id, pal, o) {
  const warmLight = lighten(pal.bg, 0.30)
  const light = softLight(id, { w, h, cx: w * 0.5, cy: h * 0.82, rx: w * 0.62, ry: h * 0.4, color: warmLight, opacity: 0.5 })
  const fr = hazeFractal(id, {
    w, h, color: pal.ink, opacity: o.opacity, blur: o.blur, seed: o.seed,
    mode: o.mode, reach: o.reach, depth: o.depth, roots: o.roots,
    fadeTopFrac: o.fade, strokeW: o.strokeW,
  })
  return { defs: light.defs + fr.defs, body: light.body + fr.body }
}

const subGreen = lighten(green.accent, 0.16) // lift subtitle legibility on green

const variants = [
  { id: 'ref', label: 'v1 B2 (ref)', pal: green, o: { mode: 'organic', opacity: 0.13, blur: 3, seed: 11, reach: 0.15, depth: 7, roots: 5, fade: null, strokeW: 1.4 } },
  { id: 'v2a', label: 'structured · dissolved', pal: green, o: { mode: 'structured', opacity: 0.10, blur: 4.5, seed: 4, reach: 0.12, depth: 8, roots: 10, fade: 0.52, strokeW: 1.2 } },
  { id: 'v2b', label: 'organic · dissolved · low', pal: green, o: { mode: 'organic', opacity: 0.085, blur: 6, seed: 9, reach: 0.13, depth: 7, roots: 6, fade: 0.48, strokeW: 1.3 } },
  { id: 'v2c', label: 'structured · dense low', pal: greenChroma, o: { mode: 'structured', opacity: 0.12, blur: 3.5, seed: 22, reach: 0.10, depth: 9, roots: 13, fade: 0.60, strokeW: 1.1 } },
]

const cols = []
for (const v of variants) {
  const svg = buildCover({ palette: v.pal, type: pairings.allSerif, text, w, h, align: 'left', back: buildBack(v.id, v.pal, v.o), subColor: subGreen })
  writeFileSync(`${OUT}/${v.id}.svg`, svg)
  writeFileSync(`${OUT}/${v.id}.png`, png(svg, 900))
  cols.push({ ...v, full: png(svg, 240), thumb: png(svg, 120) })
}

// grayscale helper (embed rendered png + saturate 0)
function gray(buf, width) {
  const b64 = Buffer.from(buf).toString('base64')
  const hh = Math.round(width * (h / w))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${hh}"><defs><filter id="g"><feColorMatrix type="saturate" values="0"/></filter></defs><image width="${width}" height="${hh}" href="data:image/png;base64,${b64}" filter="url(#g)"/></svg>`
  return png(svg, width)
}

// compare sheet: full row / 120px thumbnail row / grayscale row
const colW = 240, pad = 24
const fullH = Math.round(colW * (h / w)), tW = 120, tH = Math.round(tW * (h / w))
const yLabel = 24, yFull = 40, yThumb = yFull + fullH + 36, yGray = yThumb + tH + 28
const mW = pad + cols.length * (colW + pad)
const mH = yGray + tH + pad
const img = (b, x, y, ww) => `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * (h / w))}" href="data:image/png;base64,${Buffer.from(b).toString('base64')}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `${img(c.full, x, yFull, colW)}
    ${img(c.thumb, x + (colW - tW) / 2, yThumb, tW)}
    ${img(gray(c.thumb, tW), x + (colW - tW) / 2, yGray, tW)}
    <text x="${x + colW / 2}" y="${yLabel}" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#1a1a1a">${c.id}: ${c.label}</text>`
}).join('')
const labels = `<text x="8" y="${yThumb + tH / 2}" font-family="Inter Book" font-size="12" fill="#555" transform="rotate(-90 8 ${yThumb + tH / 2})" text-anchor="middle">120px</text>
  <text x="8" y="${yGray + tH / 2}" font-family="Inter Book" font-size="12" fill="#555" transform="rotate(-90 8 ${yGray + tH / 2})" text-anchor="middle">grayscale</text>`
const montage = `<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}" viewBox="0 0 ${mW} ${mH}"><rect width="${mW}" height="${mH}" fill="#d9d9d9"/>${cells}${labels}</svg>`
writeFileSync(`${OUT}/_compare.png`, png(montage, mW * 2))
console.log('rendered v2-b2 variants + _compare.png')
