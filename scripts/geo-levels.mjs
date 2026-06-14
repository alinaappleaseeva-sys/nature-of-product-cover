// Three geometrization levels of the haze for the Checkpoint-2 motif decision.
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

function cover(id, ho) {
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.86, rx: w * 0.6, ry: h * 0.4, color: lighten(green.bg, 0.3), opacity: 0.5 })
  const fr = hazeFractal(id, { w, h, color: green.ink, mode: 'structured', opacity: 0.12, blur: 3.5, seed: 22, depth: 9, fade: 0.64, strokeW: 1.1, jitter: 0, snap: true, ...ho })
  return buildCover({ palette: green, type, text, w, h, back: { defs: light.defs + fr.defs, body: light.body + fr.body }, subColor: subGreen })
}

const opts = [
  { id: 'G1 web (more structure)', h: { angle: 0.40, reach: 0.10, roots: 15, links: 0.20 } },
  { id: 'G2 lattice (balanced) ★', h: { angle: 0.46, reach: 0.09, roots: 13, links: 0.36 } },
  { id: 'G3 mist (softest)', h: { angle: 0.52, reach: 0.085, roots: 12, links: 0.28 } },
]
const cols = opts.map((o) => {
  const svg = cover(o.id, o.h)
  const full = png(svg, 300)
  // 2x bottom crop
  const cropTop = Math.round(h * 0.6), cropH = h - cropTop
  const crop = png(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${cropH}"><image x="0" y="${-cropTop}" width="${w}" height="${h}" href="data:image/png;base64,${b64(png(svg, w))}"/></svg>`, 300)
  return { ...o, full, crop }
})

const colW = 300, pad = 26, fullH = Math.round(colW * ratio), cropH2 = Math.round(colW * 0.4 * (h / w) / (0.4))
const cH = Math.round(300 * ((h - Math.round(h * 0.6)) / w))
const yFull = 46, yCrop = yFull + fullH + 28
const mW = pad + cols.length * (colW + pad), mH = yCrop + cH + pad + 24
const img = (b, x, y, ww, hh) => `<image x="${x}" y="${y}" width="${ww}" height="${hh}" href="data:image/png;base64,${b64(b)}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `${img(c.full, x, yFull, colW, fullH)}${img(c.crop, x, yCrop, colW, cH)}<text x="${x + colW / 2}" y="30" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#111">${c.id}</text><text x="${x + colW / 2}" y="${yCrop + cH + 18}" text-anchor="middle" font-family="Inter Book" font-size="12" fill="#555">2× bottom crop</text>`
}).join('')
writeFileSync('explorations/v3-finalists/_geo-levels.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#dcdcdc"/>${cells}</svg>`, mW * 2))
console.log('rendered _geo-levels.png')
