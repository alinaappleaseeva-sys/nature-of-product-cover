// Node-graph motif: 3 density variants (sparse / mid / dense) on the locked front.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover, coverLayout } from '../src/lib/layout.mjs'
import { palettes, text, families, canvas } from '../src/lib/tokens.mjs'
import { nodeGraph } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v6-nodegraph'
mkdirSync(OUT, { recursive: true })
const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')

const pal = palettes.ink
const type = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }
const comp = { titleScale: 1.06, subGap: 0.05, titleTopFrac: 0.125 }
const frontOpts = { palette: pal, type, text, w, h, align: 'left', ...comp }

const m = Math.round(w * 0.095)
const L = coverLayout({ ...frontOpts, back: { defs: '', body: '' } })
const avoid = [{ x: m * 0.5, y: L.author.y - L.author.size * 1.4, w: w * 0.36, h: L.author.size * 2.2 }]

const variants = {
  sparse: { roots: 2, depth: 4, childMin: 2, childExtra: 0.0, spread: 0.5 },
  mid: { roots: 3, depth: 5, childMin: 2, childExtra: 0.35, spread: 0.55 },
  dense: { roots: 5, depth: 5, childMin: 3, childExtra: 0.0, spread: 0.62 },
}

const cols = Object.entries(variants).map(([id, cfg]) => {
  const back = nodeGraph(id, { w, h, seed: 7, regionTop: 0.55, avoid, ...cfg })
  const svg = buildCover({ ...frontOpts, back })
  writeFileSync(`${OUT}/${id}.svg`, svg)
  writeFileSync(`${OUT}/${id}.png`, png(svg, 1000))
  return { id, full: png(svg, 300), thumb: png(svg, 120) }
})

const gray = (buf, width) => png(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width * ratio)}"><defs><filter id="g"><feColorMatrix type="saturate" values="0"/></filter></defs><image width="${width}" height="${Math.round(width * ratio)}" href="data:image/png;base64,${b64(buf)}" filter="url(#g)"/></svg>`, width)
const colW = 300, pad = 26, fullH = Math.round(colW * ratio), tW = 120, tH = Math.round(tW * ratio)
const yFull = 44, yThumb = yFull + fullH + 30, yGray = yThumb + tH + 26
const mW = pad + cols.length * (colW + pad), mH = yGray + tH + pad
const img = (b, x, y, ww) => `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
const cells = cols.map((c, i) => {
  const x = pad + i * (colW + pad)
  return `${img(c.full, x, yFull, colW)}${img(c.thumb, x + (colW - tW) / 2, yThumb, tW)}${img(gray(c.thumb, tW), x + (colW - tW) / 2, yGray, tW)}<text x="${x + colW / 2}" y="28" text-anchor="middle" font-family="Inter Book" font-size="15" fill="#111">${c.id}</text>`
}).join('')
const labels = ['full', '120px', 'grayscale'].map((t, i) => `<text x="10" y="${[yFull, yThumb, yGray][i] + 14}" font-family="Inter Book" font-size="11" fill="#555">${t}</text>`).join('')
writeFileSync(`${OUT}/_compare.png`, png(`<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}"><rect width="${mW}" height="${mH}" fill="#cfcfcf"/>${cells}${labels}</svg>`, mW * 2))
console.log('rendered v6 nodegraph variants + _compare.png')
