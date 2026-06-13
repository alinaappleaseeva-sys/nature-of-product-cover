// Decide the lead title weight: Light 330 / Book 390 / Display 440 on the green lead.
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
function back(id) {
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.84, rx: w * 0.6, ry: h * 0.4, color: lighten(green.bg, 0.3), opacity: 0.5 })
  const fr = hazeFractal(id, { w, h, color: green.ink, mode: 'structured', opacity: 0.12, blur: 3.5, seed: 22, reach: 0.10, depth: 9, roots: 15, fade: 0.60, strokeW: 1.1 })
  return { defs: light.defs + fr.defs, body: light.body + fr.body }
}
const weights = [
  { id: 'Light 330', fam: families.titleLight },
  { id: 'Book 390', fam: families.titleBook },
  { id: 'Display 440', fam: families.title },
]
const cols = weights.map((wt) => {
  const svg = buildCover({ palette: green, type: { title: wt.fam, sub: families.serifText, author: families.serifCaps }, text, w, h, back: back(wt.id), subColor: subGreen })
  return { ...wt, svg }
})

const wrap = (inner, width) => png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * ratio)}">${inner}</svg>`, width)
const blur = (svg, width) => wrap(`<defs><filter id="f"><feGaussianBlur stdDeviation="2.2"/></filter></defs><image width="${width}" height="${Math.round(width * ratio)}" href="data:image/png;base64,${b64(png(svg, width))}" filter="url(#f)"/>`, width)
const rows = [
  { label: '150px', f: (c) => png(c.svg, 150), w: 150 },
  { label: '88px', f: (c) => png(c.svg, 88), w: 88 },
  { label: '60px', f: (c) => png(c.svg, 60), w: 60 },
  { label: 'blur', f: (c) => blur(c.svg, 150), w: 150 },
]
const pad = 26, colW = 180, lab = 70
const mW = lab + cols.length * (colW + pad)
let y = 38; const place = []
for (const r of rows) { const rh = Math.round(r.w * ratio); place.push({ r, y, rh }); y += rh + 32 }
const img = (b, x, yy, ww) => `<image x="${x}" y="${yy}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
let body = cols.map((c, i) => `<text x="${lab + i * (colW + pad) + colW / 2}" y="24" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#111">${c.id}</text>`).join('')
for (const p of place) {
  body += `<text x="8" y="${p.y + p.rh / 2}" font-family="Inter Book" font-size="13" fill="#444">${p.r.label}</text>`
  cols.forEach((c, i) => { body += img(p.r.f(c), lab + i * (colW + pad) + (colW - p.r.w) / 2, p.y, p.r.w) })
}
writeFileSync('explorations/v3-finalists/_weight.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${y + 8}"><rect width="${mW}" height="${y + 8}" fill="#dcdcdc"/>${body}</svg>`, mW * 2))
console.log('rendered _weight.png')
