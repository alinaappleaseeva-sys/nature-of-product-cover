// Canonical cover definitions (the locked solution). One source of truth shared
// by render + print pipelines. See design.md for the rationale behind each value.
import { buildCover, coverLayout } from './layout.mjs'
import { palettes, text, families, canvas } from './tokens.mjs'
import { nodeGraph } from './motifs.mjs'

// Lead: warm near-black, typography-first, with a barely-noticeable self-similar
// haze FIELD (paper depth), not an object. (v5 — see changelog for the journey.)
export const leadPalette = palettes.ink
const leadType = { title: families.titleBook, sub: families.serifText, author: families.serifCaps }
const comp = { titleScale: 1.06, subGap: 0.05, titleTopFrac: 0.125 } // massive title high, big gap, empty bottom

// Subtle node-graph motif (fractal branching, 5 levels) in the lower 45%, with the
// author block carved out. Styling per spec: cream nodes/edges, very low opacity.
function leadBack(w, h) {
  const m = Math.round(w * 0.095)
  const L = coverLayout({ palette: leadPalette, type: leadType, text, w, h, align: 'left', back: { defs: '', body: '' }, ...comp })
  const avoid = [{ x: m * 0.5, y: L.author.y - L.author.size * 1.4, w: w * 0.36, h: L.author.size * 2.2 }]
  return nodeGraph('lead', {
    w, h, seed: 7, regionTop: 0.55, avoid,
    roots: 5, depth: 5, childMin: 3, childExtra: 0.0, spread: 0.62,
    circleColor: '#EEE4D0', circleOp: 0.21, lineColor: '#EEE4D0', lineOp: 0.14, lineW: 0.5,
  })
}

/** Layout opts for the locked lead (shared by SVG render + outline pipeline). */
export function leadOpts(size = 'ebook') {
  const { w, h } = canvas[size]
  return { palette: leadPalette, type: leadType, text, w, h, align: 'left', ...comp, back: leadBack(w, h) }
}

/** The locked lead cover. size: 'ebook' | 'print' (geometry scales by width). */
export function buildLead(size = 'ebook') {
  return buildCover(leadOpts(size))
}
