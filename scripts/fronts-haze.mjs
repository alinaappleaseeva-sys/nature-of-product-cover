// Step 3: three haze-FIELD variants on the chosen ink front + the 4 tests.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover, coverLayout } from '../src/lib/layout.mjs'
import { text, pairings, canvas } from '../src/lib/tokens.mjs'
import { hazeField } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v5-haze'
mkdirSync(OUT, { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')

const ink = { name: 'Warm near-black', bg: '#16181A', ink: '#ECE6DA', accent: '#9A7B4F', dark: true }
const text2 = { ...text, titleLines: ['Nature of', 'Product'], subtitleLines: ['How to Build Products So Valuable', 'They Look Like Magic'] }
const comp = { titleScale: 1.06, subGap: 0.05, titleTopFrac: 0.125 }
const frontOpts = { palette: ink, type: pairings.allSerif, text: text2, w, h, align: 'left', ...comp }

const m = Math.round(w * 0.095)
const L = coverLayout({ ...frontOpts, back: { defs: '', body: '' } })
const avoid = [
  { x: m * 0.5, y: L.title.top - L.title.size, w: w * 0.72, h: (L.title.lines.length - 1) * L.title.leading + L.title.size * 1.15 },
  { x: m * 0.6, y: L.sub.y - L.sub.size, w: w * 0.62, h: (L.sub.lines.length - 1) * L.sub.leading + L.sub.size * 1.5 },
  { x: m * 0.6, y: L.author.y - L.author.size, w: w * 0.34, h: L.author.size * 1.6 },
]

const variants = [
  { id: 'soft', density: 0.55 },
  { id: 'mid', density: 1.0 },
  { id: 'much', density: 1.7 },
]
const cols = variants.map((v) => {
  const back = hazeField(v.id, { w, h, color: '#A7895C', avoid, density: v.density, blur: 0.8, seed: 3 })
  const svg = buildCover({ ...frontOpts, back })
  writeFileSync(`${OUT}/${v.id}.svg`, svg)
  writeFileSync(`${OUT}/${v.id}.png`, png(svg, 1000))
  return { ...v, full: png(svg, 300), thumb: png(svg, 120) }
})

const filt = (buf, width, f) => png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * ratio)}"><defs><filter id="f">${f}</filter></defs><image width="${width}" height="${Math.round(width * ratio)}" href="data:image/png;base64,${b64(buf)}" filter="url(#f)"/></svg>`, width)
const colW = 300, pad = 26, fullH = Math.round(colW * ratio), tW = 120, tH = Math.round(tW * ratio)
const yFull = 44, yThumb = yFull + fullH + 30, yGray = yThumb + tH + 26, yBlur = yGray + tH + 26
const mW = pad + cols.length * (colW + pad), mH = yBlur + tH + pad
const img = (b, x, y, ww) => `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  const fullBuf = png(buildCover({ ...frontOpts, back: hazeField(c.id, { w, h, color: '#A7895C', avoid, density: c.density, blur: 0.8, seed: 3 }) }), colW)
  return `${img(fullBuf, x, yFull, colW)}${img(c.thumb, x + (colW - tW) / 2, yThumb, tW)}${img(filt(c.thumb, tW, '<feColorMatrix type="saturate" values="0"/>'), x + (colW - tW) / 2, yGray, tW)}${img(filt(c.thumb, tW, '<feGaussianBlur stdDeviation="1.6"/>'), x + (colW - tW) / 2, yBlur, tW)}<text x="${x + colW / 2}" y="28" text-anchor="middle" font-family="Inter Book" font-size="14" fill="#111">${c.id} (density ${c.density})</text>`
}).join('')
const labels = ['full', '120px', 'grayscale', 'blur'].map((t, i) => `<text x="10" y="${[yFull, yThumb, yGray, yBlur][i] + 14}" font-family="Inter Book" font-size="11" fill="#555">${t}</text>`).join('')
writeFileSync(`${OUT}/_compare.png`, png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#cfcfcf"/>${cells}${labels}</svg>`, mW * 2))
console.log('rendered v5 haze variants + _compare.png')
