// Perceptual test for the locked master: full / 120px / 60px / grayscale / blur.
// Run: npm run test:visual
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildLead } from '../src/lib/covers.mjs'
import { canvas } from '../src/lib/tokens.mjs'

mkdirSync('exports/thumbnails', { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')
const svg = buildLead('ebook')

const filt = (width, f) => png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * ratio)}"><defs><filter id="f">${f}</filter></defs><image width="${width}" height="${Math.round(width * ratio)}" href="data:image/png;base64,${b64(png(svg, width))}" filter="url(#f)"/></svg>`, width)

const tiles = [
  { label: 'full', b: png(svg, 300), w: 300 },
  { label: '120px', b: png(svg, 120), w: 120 },
  { label: '60px', b: png(svg, 60), w: 60 },
  { label: 'grayscale', b: filt(160, '<feColorMatrix type="saturate" values="0"/>'), w: 160 },
  { label: 'blur/squint', b: filt(160, '<feGaussianBlur stdDeviation="2.4"/>'), w: 160 },
]
const pad = 24, gap = 24
let x = pad
const place = tiles.map((t) => { const o = { ...t, x }; x += t.w + gap; return o })
const mW = x - gap + pad
const maxH = Math.max(...tiles.map((t) => Math.round(t.w * ratio)))
const mH = 40 + maxH + 30
const body = place.map((t) => `<image x="${t.x}" y="36" width="${t.w}" height="${Math.round(t.w * ratio)}" href="data:image/png;base64,${b64(t.b)}"/><text x="${t.x + t.w / 2}" y="24" text-anchor="middle" font-family="Inter Book" font-size="13" fill="#111">${t.label}</text>`).join('')
writeFileSync('exports/thumbnails/_test-sheet.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#d9d9d9"/>${body}</svg>`, mW * 2))
console.log('rendered exports/thumbnails/_test-sheet.png')
