// Perceptual stress test: the two green leads (F1 heavier title vs F2 lighter)
// at shrinking thumbnail sizes + grayscale + blur/squint. Decides title weight.
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { canvas } from '../src/lib/tokens.mjs'

const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')

const items = [
  { id: 'F1 (Display)', file: 'explorations/v3-finalists/F1-green-structured.svg' },
  { id: 'F2 (Display Light)', file: 'explorations/v3-finalists/F2-green-lighttitle.svg' },
]
for (const it of items) it.svg = readFileSync(it.file, 'utf8')

const wrap = (inner, width) => png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * ratio)}">${inner}</svg>`, width)
const plain = (it, width) => png(it.svg, width)
const filt = (it, width, f) => wrap(`<defs><filter id="f">${f}</filter></defs><image width="${width}" height="${Math.round(width * ratio)}" href="data:image/png;base64,${b64(png(it.svg, width))}" filter="url(#f)"/>`, width)

const rows = [
  { label: '160px', render: (it) => plain(it, 160), w: 160 },
  { label: '96px', render: (it) => plain(it, 96), w: 96 },
  { label: '64px', render: (it) => plain(it, 64), w: 64 },
  { label: 'gray 110', render: (it) => filt(it, 110, '<feColorMatrix type="saturate" values="0"/>'), w: 110 },
  { label: 'blur 160', render: (it) => filt(it, 160, '<feGaussianBlur stdDeviation="2.2"/>'), w: 160 },
]

const pad = 26, colW = 190, labelColW = 80
const mW = labelColW + items.length * (colW + pad)
let y = 40
const placements = []
for (const r of rows) {
  const rh = Math.round(r.w * ratio)
  placements.push({ r, y, rh })
  y += rh + 34
}
const mH = y + 10
const img = (b, x, yy, ww) => `<image x="${x}" y="${yy}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
let body = items.map((it, i) => `<text x="${labelColW + i * (colW + pad) + colW / 2}" y="26" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#111">${it.id}</text>`).join('')
for (const p of placements) {
  body += `<text x="8" y="${p.y + p.rh / 2}" font-family="Inter Book" font-size="13" fill="#444">${p.r.label}</text>`
  items.forEach((it, i) => {
    const x = labelColW + i * (colW + pad) + (colW - p.r.w) / 2
    body += img(p.r.render(it), x, p.y, p.r.w)
  })
}
writeFileSync('explorations/v3-finalists/_perceptual.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#dcdcdc"/>${body}</svg>`, mW * 2))
console.log('rendered _perceptual.png')
