// Canonical cover definitions (the locked solution). One source of truth shared
// by render + print pipelines. See design.md for the rationale behind each value.
import { buildCover } from './layout.mjs'
import { palettes, text, families, canvas } from './tokens.mjs'
import { hazeFractal, softLight, lighten } from './motifs.mjs'

// Lead: B2 green, refined per Checkpoint-1 notes.
export const leadPalette = { ...palettes.greenDark, bg: '#13271C', name: 'green chroma' }
const subGreen = lighten(leadPalette.accent, 0.16)
const leadType = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }

// Haze opacity: v3 baseline was 0.12; 0.14 = a touch more presence (art-director cap).
const HAZE_OPACITY = 0.14

function leadBack(id, w, h) {
  // v3 motif: structured + angle-snap + cross-links → reads as a GRAPH/network, not a
  // tree, kept barely-noticeable so typography leads (brief: fractal must not dominate).
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.86, rx: w * 0.6, ry: h * 0.4, color: lighten(leadPalette.bg, 0.3), opacity: 0.5 })
  const fr = hazeFractal(id, { w, h, color: leadPalette.ink, mode: 'structured', opacity: HAZE_OPACITY, blur: 3.5, seed: 22, reach: 0.09, depth: 9, roots: 13, fade: 0.64, strokeW: 1.1, jitter: 0, snap: true, links: 0.36, angle: 0.46 })
  return { defs: light.defs + fr.defs, body: light.body + fr.body }
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
