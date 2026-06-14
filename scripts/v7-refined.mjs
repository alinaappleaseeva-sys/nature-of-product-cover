// v7 exploration: refined v4 lit-dendrites.
// Three targeted changes vs the v4 baseline:
//   1. noTrunk — branches emerge directly from root, no visible single stem
//   2. 55% scale — all reach values × 0.55, centred at x=0.44
//   3. glowOpacity 0.16 → 0.08
// Outputs: refined.png, refined-zoom.png, _compare.png
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { buildCover } from '../src/lib/layout.mjs'
import { palettes, text, families, canvas } from '../src/lib/tokens.mjs'
import { litDendrites } from '../src/lib/motifs.mjs'

const OUT = 'explorations/v7-v4-refined'
mkdirSync(OUT, { recursive: true })

const fontOpts = { fontDirs: ['assets/fonts'], loadSystemFonts: false, defaultFontFamily: 'Fraunces Display' }
const { w, h } = canvas.ebook
const ratio = h / w
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fontOpts }).render().asPng()
const b64 = (b) => Buffer.from(b).toString('base64')

const pal = palettes.ink
const type = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }
const comp = { titleScale: 1.06, subGap: 0.05, titleTopFrac: 0.125 }

// ── v4 baseline dendrites (staged heights: low · mid · tall focal at x=0.44) ──
const v4Dendrites = [
  { x: 0.25, reach: 0.28, depth: 7, seed: 3,  lean: -0.25 },
  { x: 0.62, reach: 0.24, depth: 6, seed: 8,  lean:  0.22 },
  { x: 0.36, reach: 0.36, depth: 8, seed: 14, lean: -0.10 },
  { x: 0.52, reach: 0.33, depth: 7, seed: 19, lean:  0.12 },
  { x: 0.44, reach: 0.44, depth: 9, seed: 21, lean:  0    },
]
const light = { x: w * 0.44, y: h * 0.74, r: w * 0.72 }

const v4Params = {
  w, h, light,
  dendrites: v4Dendrites,
  glowOpacity: 0.16,
  blur: 2, fadeTopFrac: 0.6, branchAngle: 0.46, ratio: 0.72,
  strokeW: 1.1, jitter: 0.08, gamma: 1.6, extra: 0,
  lightColor: '#EAD9B8', shadow: '#2b3a30', maxOpacity: 0.5, buckets: 7,
}

// ── v7 refined: apply three changes + position adjustment ────────────────────
// Position: center x 0.44→0.40 (dx=-0.04), center y 0.85→0.78 (baseY 0.99→0.92)
const v7Dendrites = v4Dendrites.map(d => ({
  ...d,
  reach: d.reach * 0.55,
  x: d.x - 0.04,
  baseY: 0.92,
}))

const v7Params = {
  ...v4Params,
  dendrites: v7Dendrites,
  light: { x: w * 0.40, y: h * 0.67, r: w * 0.72 },
  glowOpacity: 0.08,   // change 3
  noTrunk: true,       // change 1
  // change 2: reach × 0.55 applied above; x=0.44 centring preserved in v4Dendrites
}

// ── build SVGs ────────────────────────────────────────────────────────────────
function makeSvg(id, motifParams) {
  const back = litDendrites(id, motifParams)
  return buildCover({ palette: pal, type, text, w, h, align: 'left', ...comp, back })
}

const svgV4 = makeSvg('v4ref', v4Params)
const svgV7 = makeSvg('v7ref', v7Params)

// ── refined.png — full size ───────────────────────────────────────────────────
writeFileSync(`${OUT}/refined.png`, png(svgV7, w))
console.log('  refined.png')

// ── refined-zoom.png — lower band (bottom ~40%), 2× res ───────────────────────
// Show y = 1540..2560 (1020px of the 2560px height) at double resolution
const zoomTop = 1540, zoomH = h - zoomTop
const svgZoom = svgV7
  .replace(`width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"`,
           `width="${w}" height="${zoomH}" viewBox="0 ${zoomTop} ${w} ${zoomH}"`)
writeFileSync(`${OUT}/refined-zoom.png`, png(svgZoom, w * 2))
console.log('  refined-zoom.png')

// ── _compare.png — original v4 | refined v7 ───────────────────────────────────
const colW = 400, pad = 32, fullH = Math.round(colW * ratio)
const yLabel = 22, yFull = 36
const mW = pad * 3 + colW * 2, mH = yFull + fullH + pad

const imgEl = (b, x, y, ww) =>
  `<image x="${x}" y="${y}" width="${ww}" height="${Math.round(ww * ratio)}" href="data:image/png;base64,${b64(b)}"/>`
const labelEl = (t, x) =>
  `<text x="${x}" y="${yLabel}" text-anchor="middle" font-family="Inter Book" font-size="14" fill="#e0dcd5">${t}</text>`

const pv4 = png(svgV4, colW)
const pv7 = png(svgV7, colW)

const x0 = pad, x1 = pad * 2 + colW
const cells = [
  labelEl('v4 original — trunk · full size · glow 0.16', x0 + colW / 2),
  labelEl('v7 refined — no trunk · 55% scale · glow 0.08', x1 + colW / 2),
  imgEl(pv4, x0, yFull, colW),
  imgEl(pv7, x1, yFull, colW),
].join('')

const compareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mW}" height="${mH}">
  <rect width="${mW}" height="${mH}" fill="#1a1c1e"/>
  ${cells}
</svg>`
writeFileSync(`${OUT}/_compare.png`, png(compareSvg, mW * 2))
console.log('  _compare.png')

console.log(`\ndone → ${OUT}/`)
