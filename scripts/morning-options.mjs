// Teed-up options for Checkpoint 2 (the two open questions), RGB only.
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
const back = (id, opacity) => {
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.84, rx: w * 0.6, ry: h * 0.4, color: lighten(green.bg, 0.3), opacity: 0.5 })
  const fr = hazeFractal(id, { w, h, color: green.ink, mode: 'structured', opacity, blur: 3.5, seed: 22, reach: 0.10, depth: 9, roots: 15, fade: 0.60, strokeW: 1.1 })
  return { defs: light.defs + fr.defs, body: light.body + fr.body }
}
const t = (author) => ({ title: families.titleBook, sub: families.serifText, author })

const opts = [
  { id: 'locked (haze .12, serif caps)', type: t(families.serifCaps), op: 0.12 },
  { id: 'haze .10 (more subliminal)', type: t(families.serifCaps), op: 0.10 },
  { id: 'author Inter caps', type: t(families.sansMedium), op: 0.12 },
]
const cols = opts.map((o) => ({ ...o, buf: png(buildCover({ palette: green, type: o.type, text, w, h, back: back(o.id, o.op), subColor: subGreen }), 300) }))

const colW = 300, pad = 26, fullH = Math.round(colW * ratio)
const mW = pad + cols.length * (colW + pad), mH = 50 + fullH + pad
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `<image x="${x}" y="46" width="${colW}" height="${fullH}" href="data:image/png;base64,${b64(c.buf)}"/><text x="${x + colW / 2}" y="30" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#111">${c.id}</text>`
}).join('')
writeFileSync('explorations/v3-finalists/_morning-options.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#dcdcdc"/>${cells}</svg>`, mW * 2))
console.log('rendered _morning-options.png')
