// Final density decision for v6 nodegraph.
// Creates one bridge variant between dense-brighter (too faint) and
// dense-bright-more (too loud), then compares all three.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { buildCover, coverLayout } from '../src/lib/layout.mjs'
import { palettes, text, families, canvas } from '../src/lib/tokens.mjs'
import { nodeGraph } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v6-nodegraph'
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

// Dense structure — identical to committed dense.svg baseline
const denseStruct = { roots: 5, depth: 5, childMin: 3, childExtra: 0.0, spread: 0.62, seed: 7 }

// Bridge variant: circleOp / lineOp midway in the brief's corridor (0.20–0.22 / 0.14–0.15)
const back = nodeGraph('bridge', {
  w, h, avoid, regionTop: 0.55,
  ...denseStruct,
  circleColor: '#EEE4D0', circleOp: 0.21,
  lineColor: '#EEE4D0',   lineOp: 0.14, lineW: 0.5,
})
const svg = buildCover({ ...frontOpts, back })
writeFileSync(`${OUT}/dense-bridge.png`, png(svg, w))
writeFileSync(`${OUT}/dense-bridge.svg`, svg)
console.log('  dense-bridge.png')

// Compare: dense-brighter | dense-bridge | dense-bright-more (load existing PNGs from disk)
const existing = ['dense-brighter', 'dense-bridge', 'dense-bright-more'].map(id => ({
  id,
  buf: readFileSync(`${OUT}/${id}.png`),
}))

const colW = 340, pad = 24, fullH = Math.round(colW * ratio)
const yLabel = 20, yFull = 34
const mW = pad + existing.length * (colW + pad), mH = yFull + fullH + pad

const imgEl = (b, x, y, ww) =>
  `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
const labelEl = (t, x) =>
  `<text x="${x}" y="${yLabel}" text-anchor="middle" font-family="Inter Book" font-size="13" fill="#c8c4bc">${t}</text>`

const cells = existing.map(({ id, buf }, i) => {
  const x = pad + i * (colW + pad)
  return labelEl(id, x + colW / 2) + imgEl(buf, x, yFull, colW)
}).join('')

const compareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}">
  <rect width="${mW}" height="${mH}" fill="#141618"/>
  ${cells}
</svg>`
writeFileSync(`${OUT}/_final-compare.png`, png(compareSvg, mW * 2))
console.log('  _final-compare.png')
console.log(`\ndone → ${OUT}/`)
