// Canonical cover definitions (the locked solution). One source of truth shared
// by render + print pipelines. See design.md for the rationale behind each value.
import { buildCover } from './layout.mjs'
import { palettes, text, families, canvas } from './tokens.mjs'
import { litDendrites, softLight, lighten } from './motifs.mjs'

// Lead: B2 green, refined per Checkpoint-1 notes.
export const leadPalette = { ...palettes.greenDark, bg: '#13271C', name: 'green chroma' }
const subGreen = lighten(leadPalette.accent, 0.16)
const leadType = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }

function leadBack(id, w, h) {
  // Composed grove with directional light → volume (one lit focal, rest in shadow).
  // Sparse, heights staged low → medium → one tall focal that sets the centre.
  const focalX = 0.44
  return litDendrites(id, {
    w, h,
    light: { x: w * focalX, y: h * 0.78, r: w * 0.38 }, // at the focal, off-centre → directional volume
    blur: 1.5, fadeTopFrac: 0.58, branchAngle: 0.40, ratio: 0.75, strokeW: 0.95,
    jitter: 0.26, gamma: 1.3, maxOpacity: 0.92, glowOpacity: 0.16, extra: 0.35,
    lightColor: '#CDB892', shadow: '#1f2e24', // warm lit dendrite, deep-green shadow
    // asymmetric grove: ONE lush lit hero, the rest smaller and subordinate.
    // short trunks (branching starts at once) + staged heights low/medium/tall.
    dendrites: [
      { x: focalX, baseY: 0.85, reach: 0.045, depth: 12, seed: 5 },  // tall lush hero (lit)
      { x: 0.67, baseY: 0.90, reach: 0.038, depth: 10, seed: 19 },   // medium (shadow side)
      { x: 0.22, baseY: 0.94, reach: 0.028, depth: 8, seed: 31 },    // low
      { x: 0.82, baseY: 0.96, reach: 0.024, depth: 7, seed: 8 },     // low, faint
    ],
  })
}

/** Layout opts for the locked lead (shared by SVG render + outline pipeline). */
export function leadOpts(size = 'ebook') {
  const { w, h } = canvas[size]
  return { palette: leadPalette, type: leadType, text, w, h, align: 'left', back: leadBack('lead', w, h), subColor: subGreen }
}

/** The locked lead cover. size: 'ebook' | 'print' (geometry scales by width). */
export function buildLead(size = 'ebook') {
  return buildCover(leadOpts(size))
}

// Light fallback (A2 paper).
export function buildFallback(size = 'ebook') {
  const { w, h } = canvas[size]
  return buildCover({
    palette: palettes.paper,
    type: { title: families.titleBook, sub: families.sansBook, author: families.sansMedium },
    text, w, h, align: 'left', back: { defs: '', body: '' },
  })
}
