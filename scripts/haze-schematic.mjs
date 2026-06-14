// Find the right geometrization: tree-ish vs graph/network (snap + cross-links).
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { palettes, text, families, canvas } from '../src/lib/tokens.mjs'
import { hazeFractal, softLight, lighten } from '../src/lib/motifs.mjs'

const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')
const green = { ...palettes.greenDark, bg: '#13271C' }
const subGreen = lighten(green.accent, 0.16)
const type = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }

function cover(id, hopts) {
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.84, rx: w * 0.6, ry: h * 0.4, color: lighten(green.bg, 0.3), opacity: 0.5 })
  const fr = hazeFractal(id, { w, h, color: green.ink, mode: 'structured', opacity: 0.12, blur: 3.5, seed: 22, reach: 0.10, depth: 9, roots: 15, fade: 0.62, strokeW: 1.1, ...hopts })
  return buildCover({ palette: green, type, text, w, h, back: { defs: light.defs + fr.defs, body: light.body + fr.body }, subColor: subGreen })
}

const opts = [
  { id: 'current (tree-ish)', h: { jitter: 0.06, snap: false, links: 0 } },
  { id: 'schematic +12% (snap, few links)', h: { jitter: 0, snap: true, links: 0.18 } },
  { id: 'schematic +25% (more links)', h: { jitter: 0, snap: true, links: 0.4 } },
]
const cols = opts.map((o) => ({ ...o, full: png(cover(o.id, o.h), 300), thumb: png(cover(o.id, o.h), 120) }))

const colW = 300, pad = 26, fullH = Math.round(colW * ratio), tW = 120, tH = Math.round(tW * ratio)
const yFull = 46, yThumb = yFull + fullH + 30
const mW = pad + cols.length * (colW + pad), mH = yThumb + tH + pad
const img = (b, x, y, ww) => `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `${img(c.full, x, yFull, colW)}${img(c.thumb, x + (colW - tW) / 2, yThumb, tW)}<text x="${x + colW / 2}" y="30" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#111">${c.id}</text>`
}).join('')
writeFileSync('explorations/v3-finalists/_schematic.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#dcdcdc"/>${cells}</svg>`, mW * 2))
console.log('rendered _schematic.png')
