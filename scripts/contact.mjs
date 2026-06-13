// Contact sheet for Checkpoint 1. Renders the 3 reweighted directions across
// ≤2 palettes each, plus a thumbnail montage (shelf/thumbnail test).
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { palettes, text, pairings, canvas } from '../src/lib/tokens.mjs'
import { hazeFractal, geoDepth, softLight, lighten } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v1-contact-sheet'
mkdirSync(OUT, { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()

// merge motif fragments
const merge = (...parts) => ({
  defs: parts.map((p) => p.defs).join(''),
  body: parts.map((p) => p.body).join(''),
})

function back(id, dir, pal) {
  const warmLight = lighten(pal.bg, 0.34)
  if (dir === 'typographic') {
    // just a whisper of light to lift the title; dark only
    return pal.dark
      ? softLight(id, { w, h, cx: w * 0.34, cy: h * 0.27, rx: w * 0.7, ry: h * 0.4, color: warmLight, opacity: 0.5 })
      : { defs: '', body: '' }
  }
  if (dir === 'haze') {
    const light = softLight(id, { w, h, cx: w * 0.52, cy: h * 0.74, rx: w * 0.6, ry: h * 0.42, color: warmLight, opacity: pal.dark ? 0.55 : 0.0 })
    const fr = hazeFractal(id, { w, h, color: pal.ink, opacity: pal.dark ? 0.13 : 0.16, blur: 3, seed: 11 })
    return merge(light, fr)
  }
  if (dir === 'geo') {
    const gd = geoDepth(id, { w, h, palette: pal, steps: 9, strength: pal.dark ? 0.06 : 0.05 })
    const light = softLight(id, { w, h, cx: w * 0.3, cy: h * 0.3, rx: w * 0.7, ry: h * 0.45, color: warmLight, opacity: pal.dark ? 0.4 : 0.0 })
    return merge(gd, light)
  }
  return { defs: '', body: '' }
}

const variants = [
  { id: 'A1', dir: 'typographic', pal: 'warmDark', type: 'allSerif', label: 'Typographic · warm-dark · serif' },
  { id: 'A2', dir: 'typographic', pal: 'paper', type: 'serifSans', label: 'Typographic · paper · serif+sans' },
  { id: 'B1', dir: 'haze', pal: 'warmDark', type: 'allSerif', label: 'Graph-haze · warm-dark · serif' },
  { id: 'B2', dir: 'haze', pal: 'greenDark', type: 'allSerif', label: 'Graph-haze · green-dark · serif' },
  { id: 'C1', dir: 'geo', pal: 'warmDark', type: 'allSerif', label: 'Geometric · warm-dark · serif' },
  { id: 'C2', dir: 'geo', pal: 'paper', type: 'serifSans', label: 'Geometric · paper · serif+sans' },
]

const thumbs = []
for (const v of variants) {
  const pal = palettes[v.pal]
  const svg = buildCover({ palette: pal, type: pairings[v.type], text, w, h, align: 'left', back: back(v.id, v.dir, pal) })
  writeFileSync(`${OUT}/${v.id}.svg`, svg)
  writeFileSync(`${OUT}/${v.id}.png`, png(svg, 820))
  const t = png(svg, 150)
  thumbs.push({ ...v, b64: Buffer.from(t).toString('base64') })
  console.log(`rendered ${v.id}  ${v.label}`)
}

// thumbnail montage (shelf/thumbnail test)
const tw = 150, th = Math.round(150 * (h / w)), pad = 18, labelH = 40
const cols = thumbs.length
const mW = pad + cols * (tw + pad)
const mH = labelH + th + pad
const cells = thumbs.map((t, i) => {
  const x = pad + i * (tw + pad)
  return `<image x="${x}" y="${labelH}" width="${tw}" height="${th}" href="data:image/png;base64,${t.b64}"/>
    <text x="${x + tw / 2}" y="26" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#222">${t.id}</text>`
}).join('')
const montage = `<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}" viewBox="0 0 ${mW} ${mH}"><rect width="${mW}" height="${mH}" fill="#cfcfcf"/>${cells}</svg>`
writeFileSync(`${OUT}/_thumbnails.png`, png(montage, mW * 2))
console.log('rendered montage _thumbnails.png')
