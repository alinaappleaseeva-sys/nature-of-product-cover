// Step 1: three CLEAN typographic fronts (no haze). New composition:
// 2-line massive title (Nature of / Product), compact subtitle with a big gap,
// quiet author, optical centre slightly high (emptier bottom). Pick by hierarchy
// + thumbnail confidence.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { text, pairings, canvas } from '../src/lib/tokens.mjs'

const OUT = 'explorations/v5-fronts'
mkdirSync(OUT, { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')

// 2-line title + compact subtitle
const text2 = {
  ...text,
  titleLines: ['Nature of', 'Product'],
  subtitleLines: ['How to Build Products So Valuable', 'They Look Like Magic'],
}

// three premium palettes (haze tone noted for later)
const palettes = {
  ink: { name: 'Warm near-black + off-white', bg: '#16181A', ink: '#ECE6DA', accent: '#9A7B4F', dark: true },     // bronze-smoky haze later
  paper: { name: 'Warm paper + graphite', bg: '#ECE6DA', ink: '#1E1C19', accent: '#4A4F55', dark: false },        // cool graphite haze later
  green: { name: 'Deep green + cream', bg: '#13271C', ink: '#ECE3D1', accent: '#8A9B79', dark: true },            // our identity
}

const comp = { titleScale: 1.06, subGap: 0.05, titleTopFrac: 0.125 } // massive title high, big gap, empty bottom

const cols = Object.entries(palettes).map(([k, pal]) => {
  const svg = buildCover({ palette: pal, type: pairings.allSerif, text: text2, w, h, align: 'left', back: { defs: '', body: '' }, ...comp })
  writeFileSync(`${OUT}/${k}.svg`, svg)
  writeFileSync(`${OUT}/${k}.png`, png(svg, 1000))
  return { k, pal, full: png(svg, 300), thumb: png(svg, 120) }
})

// compare sheet: full + 120 + grayscale
const gray = (buf, width) => png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * ratio)}"><defs><filter id="g"><feColorMatrix type="saturate" values="0"/></filter></defs><image width="${width}" height="${Math.round(width * ratio)}" href="data:image/png;base64,${b64(buf)}" filter="url(#g)"/></svg>`, width)
const colW = 300, pad = 26, fullH = Math.round(colW * ratio), tW = 120, tH = Math.round(tW * ratio)
const yFull = 44, yThumb = yFull + fullH + 30, yGray = yThumb + tH + 26
const mW = pad + cols.length * (colW + pad), mH = yGray + tH + pad
const img = (b, x, y, ww) => `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `${img(c.full, x, yFull, colW)}${img(c.thumb, x + (colW - tW) / 2, yThumb, tW)}${img(gray(c.thumb, tW), x + (colW - tW) / 2, yGray, tW)}<text x="${x + colW / 2}" y="28" text-anchor="middle" font-family="Inter Book" font-size="14" fill="#111">${c.k}: ${c.pal.name}</text>`
}).join('')
writeFileSync(`${OUT}/_compare.png`, png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#cfcfcf"/>${cells}</svg>`, mW * 2))
console.log('rendered v5 fronts + _compare.png')
