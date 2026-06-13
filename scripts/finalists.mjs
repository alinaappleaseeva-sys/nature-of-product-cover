// Block B — finalist set for the morning (Checkpoint 2).
// Mandate: primary B2 (green) refined + a polished light fallback (A2).
// Includes a title-weight test (Display vs Display Light) and offset light.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { palettes, text, pairings, families, canvas } from '../src/lib/tokens.mjs'
import { hazeFractal, softLight, lighten } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v3-finalists'
mkdirSync(OUT, { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()

const green = { ...palettes.greenDark, bg: '#13271C', name: 'green chroma' }
const paper = palettes.paper
const subGreen = lighten(green.accent, 0.16)

function haze(id, pal, o) {
  const warmLight = lighten(pal.bg, 0.30)
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.84, rx: w * 0.6, ry: h * 0.4, color: warmLight, opacity: pal.dark ? 0.5 : 0 })
  const fr = hazeFractal(id, { w, h, color: pal.ink, mode: 'structured', ...o })
  return { defs: light.defs + fr.defs, body: light.body + fr.body }
}

const dense = { opacity: 0.12, blur: 3.5, seed: 22, reach: 0.10, depth: 9, roots: 15, fade: 0.60, strokeW: 1.1 }
const quiet = { opacity: 0.075, blur: 4.5, seed: 7, reach: 0.11, depth: 8, roots: 9, fade: 0.5, strokeW: 1.1 }

const serifLight = { title: families.titleLight, sub: families.serifText, author: families.serifCaps }

const variants = [
  { id: 'F1-green-structured', pal: green, type: pairings.allSerif, back: (id) => haze(id, green, dense), sub: subGreen, label: 'Green · structured · title Display' },
  { id: 'F2-green-lighttitle', pal: green, type: serifLight, back: (id) => haze(id, green, dense), sub: subGreen, label: 'Green · structured · title Display Light' },
  { id: 'F3-green-minimal', pal: green, type: pairings.allSerif, back: (id) => haze(id, green, quiet), sub: subGreen, label: 'Green · minimal haze' },
  { id: 'F4-paper-fallback', pal: paper, type: pairings.serifSans, back: () => ({ defs: '', body: '' }), sub: null, label: 'Paper fallback (light)' },
]

const cols = []
for (const v of variants) {
  const svg = buildCover({ palette: v.pal, type: v.type, text, w, h, align: 'left', back: v.back(v.id), subColor: v.sub })
  writeFileSync(`${OUT}/${v.id}.svg`, svg)
  writeFileSync(`${OUT}/${v.id}.png`, png(svg, 1000))
  cols.push({ ...v, full: png(svg, 240), thumb: png(svg, 120) })
}

function gray(buf, width) {
  const b64 = Buffer.from(buf).toString('base64')
  const hh = Math.round(width * (h / w))
  return png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${hh}"><defs><filter id="g"><feColorMatrix type="saturate" values="0"/></filter></defs><image width="${width}" height="${hh}" href="data:image/png;base64,${b64}" filter="url(#g)"/></svg>`, width)
}

const colW = 240, pad = 24, fullH = Math.round(colW * (h / w)), tW = 120, tH = Math.round(tW * (h / w))
const yLabel = 24, yFull = 40, yThumb = yFull + fullH + 36, yGray = yThumb + tH + 28
const mW = pad + cols.length * (colW + pad), mH = yGray + tH + pad
const img = (b, x, y, ww) => `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * (h / w))}" href="data:image/png;base64,${Buffer.from(b).toString('base64')}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `${img(c.full, x, yFull, colW)}${img(c.thumb, x + (colW - tW) / 2, yThumb, tW)}${img(gray(c.thumb, tW), x + (colW - tW) / 2, yGray, tW)}<text x="${x + colW / 2}" y="${yLabel}" text-anchor="middle" font-family="Inter Book" font-size="14" fill="#1a1a1a">${c.id}</text>`
}).join('')
writeFileSync(`${OUT}/_compare.png`, png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#d9d9d9"/>${cells}</svg>`, mW * 2))
console.log('rendered v3 finalists + _compare.png')
