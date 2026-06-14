// Canonical cover definitions (the locked solution). One source of truth shared
// by render + print pipelines. See design.md for the rationale behind each value.
import { buildCover } from './layout.mjs'
import { palettes, text, families, canvas } from './tokens.mjs'
import { hazeFractal, softLight, lighten } from './motifs.mjs'

// Lead: B2 green, refined per Checkpoint-1 notes.
export const leadPalette = { ...palettes.greenDark, bg: '#13271C', name: 'green chroma' }
const subGreen = lighten(leadPalette.accent, 0.16)
const leadType = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }

function leadBack(id, w, h) {
  const light = softLight(id, { w, h, cx: w * 0.42, cy: h * 0.86, rx: w * 0.6, ry: h * 0.4, color: lighten(leadPalette.bg, 0.3), opacity: 0.5 })
  // structured + angle-snap + cross-links → reads as a GRAPH/network, not a tree
  // (removes the biological/Nature-magazine connotation). fade lowered for breathing.
  const fr = hazeFractal(id, { w, h, color: leadPalette.ink, mode: 'structured', opacity: 0.12, blur: 3.5, seed: 22, reach: 0.09, depth: 9, roots: 13, fade: 0.64, strokeW: 1.1, jitter: 0, snap: true, links: 0.36, angle: 0.46 })
  return { defs: light.defs + fr.defs, body: light.body + fr.body }
}

/** The locked lead cover. size: 'ebook' | 'print' (geometry scales by width). */
export function buildLead(size = 'ebook') {
  const { w, h } = canvas[size]
  return buildCover({ palette: leadPalette, type: leadType, text, w, h, align: 'left', back: leadBack('lead', w, h), subColor: subGreen })
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
